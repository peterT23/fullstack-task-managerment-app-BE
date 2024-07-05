const express = require("express");

const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");
const commentController = require("../controllers/comment.controller");
const router = express.Router();

/**
 * @route POST /comments
 * @description create new comments
 * @body {content, TaskID, commentUser}
 * @access Login required
 */

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content")
      .exists()
      .isString()
      .notEmpty()
      .withMessage("comment must be a required string"),
    body("taskId", "Invalid task Id")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createNewComment
);

/**
 * @route PUT /comments/:id
 * @description edit comment
 * @body {content}
 * @access Login required
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    body("content").isString().withMessage("must be a string"),
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.editComment
);
/**
 * @route DELETE /comments/:id
 * @description delete comment
 * @access Login required
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.deleteComment
);
/**
 * @route GET /comments/:id
 * @description get details of comment
 * @access Login required
 */

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getSingleComment
);
module.exports = router;
