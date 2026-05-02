require('dotenv').config();
const express = require('express');
const cors = require('cors');

const downloadRoutes = require('./routes/downloadRoutes');

const app = express();
app.use(cors({
  origin: ['https://stream-grab-nu.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', downloadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
