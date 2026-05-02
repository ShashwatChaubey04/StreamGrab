const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/info', downloadController.getInfo);
router.post('/download', downloadController.startDownload);
router.get('/progress/:taskId', downloadController.getProgress);
router.get('/file/:taskId', downloadController.downloadFile);

module.exports = router;
