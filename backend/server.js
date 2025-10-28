const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const mongoose = require('mongoose');
require('dotenv').config();

=======
>>>>>>> backend
const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user.js');
app.use('/api', userRoutes);
=======
// Import routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);
>>>>>>> backend

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
