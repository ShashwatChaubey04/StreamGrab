const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class Downloader {
  constructor() {
    this.tasks = new Map();
  }

  async getInfo(url) {
    return new Promise((resolve, reject) => {
      const args = [
        '--dump-json',
        '--no-warnings',
        '--add-header', 'Accept-Language:en-US,en;q=0.9',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        url
      ];
      const ytDlp = spawn('yt-dlp', args);
      
      let stdout = '';
      let stderr = '';

      ytDlp.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ytDlp.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ytDlp.on('close', async (code) => {
        if (code !== 0) {
          console.error(`yt-dlp error (code ${code}):`, stderr);
          return reject(new Error(`yt-dlp failed: ${stderr.split('\n')[0] || 'Unknown error'}`));
        }
        
        try {
          if (!stdout.trim()) {
            return reject(new Error('yt-dlp returned empty output'));
          }
          const lines = stdout.trim().split('\n');
          let parsed;
          try {
            parsed = JSON.parse(lines[0]);
            if (lines.length > 1) {
              parsed.is_playlist = true;
              parsed.playlist_count = lines.length;
            }
          } catch (e) {
            console.error('JSON Parse Error. Output was:', stdout);
            return reject(new Error('Failed to parse video information from yt-dlp'));
          }

          // Try to get transcript structured data
          let transcriptData = [];
          const captions = parsed.automatic_captions || parsed.subtitles || {};
          const lang = captions.hi ? 'hi' : (captions.en ? 'en' : Object.keys(captions)[0]);
          
          if (lang && captions[lang]) {
            const json3 = captions[lang].find(f => f.ext === 'json3' || f.protocol === 'https');
            if (json3 && json3.url) {
              try {
                const response = await fetch(json3.url);
                const data = await response.json();
                if (data.events) {
                  transcriptData = data.events
                    .filter(e => e.segs && e.tStartMs !== undefined)
                    .map(e => ({
                      time: Math.floor(e.tStartMs / 1000),
                      text: e.segs.map(s => s.utf8).join('').trim()
                    }))
                    .filter(e => e.text.length > 0);
                }
              } catch (err) {
                console.error("Failed to fetch transcript:", err);
              }
            }
          }
          parsed.transcript_data = transcriptData;
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse info JSON: ${e.message}`));
        }
      });
    });
  }

  startDownload(taskId, url, options, outputDir) {
    const { preferredHeight = 2160, isPlaylist = false, mode = 'video', audioBitrate = '192' } = options;

    const outTmpl = isPlaylist 
      ? path.join(outputDir, '%(playlist_title)s', '%(playlist_index)02d. %(title)s.%(ext)s')
      : path.join(outputDir, '%(title)s.%(ext)s');

    let args = [];
    
    if (mode === 'audio') {
      args = [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', `${audioBitrate}k`,
        '--output', outTmpl,
        '--no-warnings',
        '--embed-thumbnail',
        '--embed-metadata'
      ];
    } else {
      const fmt = `bestvideo[height<=${preferredHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${preferredHeight}]+bestaudio/best[height<=${preferredHeight}]/best`;
      args = [
        '--format', fmt,
        '--merge-output-format', 'mp4',
        '--output', outTmpl,
        '--concurrent-fragments', '4',
        '--add-chapters',
        '--progress',
        '--no-warnings',
        '--embed-chapters',
        '--embed-thumbnail', 
        '--convert-thumbnails', 'jpg',
        '--embed-metadata',
        '--add-header', 'Accept-Language:en-US,en;q=0.9',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ];
    }

    if (isPlaylist) {
      args.push('--yes-playlist');
    } else {
      args.push('--no-playlist');
    }

    args.push(url);

    const ytDlp = spawn('yt-dlp', args);

    const task = {
      process: ytDlp,
      status: 'downloading',
      progress: 0,
      speed: '',
      eta: '',
      log: [],
      clients: [] // SSE clients
    };

    this.tasks.set(taskId, task);

    const broadcast = (data) => {
      task.clients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      });
    };

    ytDlp.stdout.on('data', (data) => {
      const output = data.toString();
      // Parse progress
      // Example output: [download]  45.0% of ~50.00MiB at  3.00MiB/s ETA 00:15
      const match = output.match(/\[download\]\s+([\d.]+)%.*?at\s+([~\d.\w\/]+)\s+ETA\s+([\d:]+)/);
      if (match) {
        task.progress = parseFloat(match[1]);
        task.speed = match[2];
        task.eta = match[3];
        broadcast({ type: 'progress', progress: task.progress, speed: task.speed, eta: task.eta });
      } else if (output.includes('[Merger]') || output.includes('[ThumbnailsConvertor]') || output.includes('[Metadata]')) {
        task.status = 'processing';
        broadcast({ type: 'status', status: task.status, message: output.trim() });
      }
      task.log.push(output);
    });

    ytDlp.stderr.on('data', (data) => {
      task.log.push(`ERROR: ${data.toString()}`);
    });

    ytDlp.on('close', (code) => {
      if (code === 0) {
        task.status = 'completed';
        task.progress = 100;
        broadcast({ type: 'completed' });
      } else {
        task.status = 'error';
        broadcast({ type: 'error', message: `Exited with code ${code}` });
      }
      
      // Close SSE connections
      task.clients.forEach(client => client.end());
      task.clients = [];
    });

    return task;
  }

  addClient(taskId, res) {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    task.clients.push(res);
    // Send current state
    res.write(`data: ${JSON.stringify({ type: 'init', status: task.status, progress: task.progress, speed: task.speed, eta: task.eta })}\n\n`);
    return true;
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }
}

module.exports = new Downloader();
