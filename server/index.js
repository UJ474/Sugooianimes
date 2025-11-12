const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/verifyToken.js');
dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend origin
  credentials: true,
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

// Protected route (for testing middleware)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user, // comes from verifyToken
  });
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => res.send('API running...'));



// Server start
module.exports = app;
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
