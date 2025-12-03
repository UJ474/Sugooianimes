const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();

const app = express();

// DB connect (same as yours)
connectDB();

// ---------- CORS ----------
const FRONTEND = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

// Important → allow preflight OPTIONS to succeed
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", FRONTEND);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200);
});

app.use(express.json());

// ---------- Routes ----------
const authRoutes = require('./routes/authRoutes');
const weebRoutes = require("./routes/weebRoutes");

app.use('/api/auth', authRoutes);
app.use("/api/weeb", weebRoutes);

// test protected route
const verifyToken = require('./middleware/verifyToken');
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});

// root
app.get('/', (req, res) => res.send('API running...'));

// last: global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;