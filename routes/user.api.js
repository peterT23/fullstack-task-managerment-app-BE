const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /users
 * @description Register new user as Manager
 * @body {name, email, password, role}
 * @access Public
 */

router.post(
  "/",
  validators.validate([
    body("name", "Invalid Name").exists().isString().notEmpty(),
    body("email", "Invalid Email")
      .exists()
      .notEmpty()
      .withMessage("email is required and unique")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password")
      .exists()
      .notEmpty()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .withMessage(
        "Pass word must be at least 8 characters long,at least one lowercase letter,at least one uppercase letter, at least one number"
      ),
    body("role")
      .exists()
      .notEmpty()
      .equals("manager")
      .withMessage("Only manager can create new users"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("languages")
      .optional()
      .isString()
      .withMessage("Languages must be a string"),
    body("phone")
      .optional()
      .isNumeric()
      .default(0)
      .withMessage("phone must be a number"),
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
  ]),
  userController.register
);

/**
 * @route POST /users/member
 * @description Register new user for team member. only manager can do
 * @body {name, email, password, role}
 * @access login required
 */

router.post(
  "/member",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid Name").exists().isString().notEmpty(),
    body("email", "Invalid Email")
      .exists()
      .notEmpty()
      .withMessage("email is required and unique")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password")
      .exists()
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Pass word must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
    body("role")
      .exists()
      .notEmpty()
      .equals("member")
      .withMessage("Create member account fail"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("languages")
      .optional()
      .isString()
      .withMessage("Languages must be a string"),
    body("phone")
      .optional()
      .isNumeric()
      .default(0)
      .withMessage("phone must be a number"),
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
  ]),
  userController.createMemberAccount
);

// /**
// - @route GET /users/me
// - @description Get current user info
// - @access Login required
// */
// // router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**

- @route GET /users/:id
- @description Get a user profile
- @access Login required
*/

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);

//dont need-> create patch /me  in me controller to handle updating own user profile
/**
// - @route PUT /users/:id
// - @description Update user profile (edit user profile)
// - @body { name, avatarUrl, shortDescription, Phone ,Skills, Strength , Languages , jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
// - @access Login required
// */
// //router.put('/me')
// router.put(
//   "/:id",
//   authentication.loginRequired,
//   validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId),
//   ]),
//   userController.updateUserProfile
// );

/**
 * @route GET /users?page=1&limit=10
 * @description Get user with page and limit and search by name
 * @access Login required
 */
router.get("/", authentication.loginRequired, userController.getUsers);

/**

- @route Delete /users/:id
- @description delete user(member) 
- @access Login required
*/
router.delete("/:id", authentication.loginRequired, userController.deleteUser);

module.exports = router;
