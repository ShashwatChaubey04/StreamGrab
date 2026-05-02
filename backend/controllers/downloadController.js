const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const downloader = require('../utils/downloader');

const os = require('os');
const DOWNLOADS_DIR = path.join(os.tmpdir(), 'streamgrab-downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

exports.getInfo = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await downloader.getInfo(url);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startDownload = (req, res) => {
  const { url, quality, isPlaylist, mode = 'video' } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const taskId = uuidv4();
  const taskDir = path.join(DOWNLOADS_DIR, taskId);
  fs.mkdirSync(taskDir);

  const preferredHeight = quality === '4K' ? 2160 :
                          quality === '2K' ? 1440 :
                          quality === '1080p' ? 1080 : 720;
  
  const audioBitrate = quality === '320kbps' ? '320' :
                       quality === '256kbps' ? '256' : '128';

  try {
    downloader.startDownload(taskId, url, { preferredHeight, isPlaylist, mode, audioBitrate }, taskDir);
    res.json({ taskId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProgress = (req, res) => {
  const { taskId } = req.params;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const success = downloader.addClient(taskId, res);
  if (!success) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Task not found' })}\n\n`);
    res.end();
  }

  req.on('close', () => {
    const task = downloader.getTask(taskId);
    if (task) {
      task.clients = task.clients.filter(c => c !== res);
    }
  });
};

exports.downloadFile = (req, res) => {
  const { taskId } = req.params;
  const taskDir = path.join(DOWNLOADS_DIR, taskId);

  if (!fs.existsSync(taskDir)) {
    return res.status(404).send('Not found');
  }

  const files = fs.readdirSync(taskDir);
  if (files.length === 0) {
    return res.status(404).send('No files downloaded');
  }

  if (files.length > 1 || fs.statSync(path.join(taskDir, files[0])).isDirectory()) {
    res.setHeader('Content-Disposition', `attachment; filename="youtube_playlist_${taskId}.zip"`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => res.status(500).send({ error: err.message }));
    
    archive.pipe(res);
    archive.directory(taskDir, false);
    archive.finalize();
  } else {
    const file = files[0];
    const filePath = path.join(taskDir, file);
    res.download(filePath, file, (err) => {
      if (!err) {
        // Cleanup after successful download
        try {
          fs.rmSync(taskDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.error('Cleanup error:', cleanupErr);
        }
      }
    });
  }
};
