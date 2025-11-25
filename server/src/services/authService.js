const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/generateToken");

const JWT_SECRET = process.env.JWT_SECRET;


// SIGNUP
exports.signup = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already registered");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return {
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};


// LOGIN
exports.login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password required");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};


// REFRESH TOKEN
exports.refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error("Refresh token missing");
    err.status = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const newAccess = generateAccessToken({ id: decoded.id });
    const newRefresh = generateRefreshToken({ id: decoded.id });

    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
    };

  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.status = 401;
    throw error;
  }
};