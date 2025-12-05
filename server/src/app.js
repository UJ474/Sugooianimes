const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes');
const weebRoutes = require("./routes/weebRoutes");
const verifyToken = require('./middleware/verifyToken');

dotenv.config();
const app = express();
app.use(express.json());
connectDB(); // DB connect

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/api/weeb", weebRoutes);
app.use('/api/auth', authRoutes);



app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});


app.get('/', (req, res) => res.send('API running...'));

module.exports = app;
