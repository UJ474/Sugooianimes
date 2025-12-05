const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const id = decoded.id || decoded._id || decoded._id_str || decoded.userId;
    const email = decoded.email || decoded.em || null;

    req.user = {
      id,
      _id: id,
      email,
      raw: decoded, 
    };

    if (!id) {
      return res.status(401).json({ message: 'Invalid token payload (no id)' });
    }

    next();
  } catch (err) {
    console.error('verifyToken error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};