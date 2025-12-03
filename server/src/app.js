const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();

const app = express();

// DB connect
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));

// Lightweight preflight handler — avoids using app.options('*', ...) which can break
// in some serverless/path-to-regexp environments where '*' is parsed as a route param.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    // If your frontend needs credentials, the Access-Control-Allow-Credentials header
    // will be set by the cors middleware above for non-OPTIONS requests. For OPTIONS
    // responses set it explicitly if needed:
    if (corsOptions.credentials) res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const weebRoutes = require("./routes/weebRoutes");
app.use("/api/weeb", weebRoutes);
app.use('/api/auth', authRoutes);

// Protected route (for testing middleware)
const verifyToken = require('./middleware/verifyToken');
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user // coming from verifyToken
  });
});

// Root
app.get('/', (req, res) => res.send('API running...'));

module.exports = app;
