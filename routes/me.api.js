const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const meController = require("../controllers/me.controller");

/**
- @route GET /me
- @description Get current user info
- @access Login required
*/
router.get("/", authentication.loginRequired, meController.getCurrentUser);

/**
- @route PATCH /me
- @description UPDATE USER PROFILE
- @access Login required
- @body { name, avatarUrl, shortDescription, Phone ,Skills, Strength , Languages , jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
*/

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid Name").optional().isString(),
    body("password", "Invalid Password")
      .optional()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .withMessage(
        "Pass word must be at least 8 characters long,at least one lowercase letter,at least one uppercase letter, at least one number"
      ),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("jobTitle")
      .optional()
      .isString()
      .withMessage("JobTitle must be a string"),
    body("avatarUrl")
      .optional()
      .isString()
      .withMessage("AvatarUrl must be a string"),
    body("languages")
      .optional()
      .isString()
      .withMessage("Languages must be a string"),
    body("phone").optional().isNumeric().withMessage("phone must be a number"),
    body("facebookLink")
      .optional()
      .isString()
      .withMessage("facbook Link must be a string"),
    body("linkedinLink")
      .optional()
      .isString()
      .withMessage("linkedinLink must be a string"),
    body("twitterLink")
      .optional()
      .isString()
      .withMessage("facbook Link must be a string"),
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  meController.updateMeProfile
);
module.exports = router;
