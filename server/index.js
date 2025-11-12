const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/verifyToken.js');
const connectDB = require('./config/db.js')
dotenv.config();

const app = express();
connectDB()
// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
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
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => res.send('API running...'));



if(process.env.NODE_ENV == "development"){
  const PORT = process.env.PORT; 
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}
module.exports = app;
