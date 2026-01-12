const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const weebRoutes = require("./routes/weebRoutes");

app.use("/api/weeb", weebRoutes);
app.use('/api/auth', authRoutes);

const verifyToken = require('./middleware/verifyToken');
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});

app.get('/', (req, res) => res.send('API running...'));

module.exports = app;