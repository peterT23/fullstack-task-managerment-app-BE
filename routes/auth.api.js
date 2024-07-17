const express = require("express");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST /auth/login
 * @description Log in with email and password as manager or teamMember
 * @body {email, password, role}
 * @access Public
 */

router.post(
  "/login",
  validators.validate([
    body("email", "Invalid Email")
      .exists()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
    // .isLength({ min: 8 }),
    // .withMessage("Pass word must be at least 8 characters long")
    // .matches(/[a-z]/)
    // .withMessage("Password must contain at least one lowercase letter")
    // .matches(/[A-Z]/)
    // .withMessage("Password must contain at least one uppercase letter")
    // .matches(/\d/)
    // .withMessage("Password must contain at least one number"),
  ]),
  authController.loginWithEmail
);

module.exports = router;
