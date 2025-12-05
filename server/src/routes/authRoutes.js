const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validateRequest");
const { signupSchema, loginSchema } = require("../validations/authValidation");


router.post("/signup", validate(signupSchema), authController.signup);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", authController.refreshToken);

module.exports = router;