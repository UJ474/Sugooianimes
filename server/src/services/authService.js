const bcrypt = require("bcrypt");
const Weeb = require("../models/Weeb");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/generateToken");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;



exports.signup = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  const existing = await Weeb.findOne({ email });
  if (existing) {
    const error = new Error("Email already registered");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Weeb.create({
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



exports.login = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error("Email and password required");
    err.status = 400;
    throw err;
  }

  const user = await Weeb.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};


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