const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);

// Basic route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});