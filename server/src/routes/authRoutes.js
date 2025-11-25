const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validateRequest");
const { signupSchema, loginSchema } = require("../validations/authValidation");


// Signup
router.post("/signup", validate(signupSchema), authController.signup);

// Login
router.post("/login", validate(loginSchema), authController.login);

// Refresh token
router.post("/refresh", authController.refreshToken);

module.exports = router;