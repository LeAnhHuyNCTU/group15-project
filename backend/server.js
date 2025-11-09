const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Hoạt động 5)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupDB';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');

app.use('/api', userRoutes); // Mount user routes tại /api
app.use('/api/auth', authRoutes); // Mount auth routes tại /api/auth

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
