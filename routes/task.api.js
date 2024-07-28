const express = require("express");
const taskController = require("../controllers/task.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const router = express.Router();

// <!-- the actions such as edit, create, delete task must be handled by manager -->

/**
 * @route POST /tasks
 * @description create a new task
 * @body { title, description, startdate,enddate, status, projectID, createdBy, AssignedTo ,priority }
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("title", "Missing title")
      .exists()
      .isString()
      .withMessage("Title must be a string")
      .notEmpty()
      .withMessage("Title must be required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("dueDate")
      .isISO8601()
      .withMessage("Due date must be a valid date")
      .notEmpty()
      .withMessage("Due date is required"),
    // body("startDate").custom((value, { req }) => {
    //   if (new Date(value) >= new Date(req.body.dueDate)) {
    //     throw new Error("Start date must be before due date");
    //   }
    //   return true;
    // }),
    body("status")
      .optional()
      .isIn(["pending", "ongoing", "review", "done", "archive"])
      .default("pending")
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("projectId")
      .notEmpty()
      .custom(validators.checkObjectId)
      .withMessage("invalid project"),
    body("assignees")
      .optional()
      .isArray()
      .withMessage("Assignees must be an array")
      .custom((assignees) => {
        for (const id of assignees) {
          if (!validators.checkObjectId(id)) {
            throw new Error("Invalid assignee ID");
          }
        }
        return true;
      })
      .withMessage("Invalid assignee ID"),
  ]),
  taskController.createNewTask
);

/**
 * @route PUT /tasks/:id
 * @description Update a task/edit task
 *{ title, description, startdate,enddate, status, createdBy, AssignedTo , priority}
 * @access Login required
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    body("title", "Missing title")
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
    // body("startDate").custom((value, { req }) => {
    //   if (new Date(value) >= new Date(req.body.dueDate)) {
    //     throw new Error("Start date must be before due date");
    //   }
    //   return true;
    // }),
    body("status")
      .optional()
      .isIn(["pending", "ongoing", "review", "done", "archive"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.updateTask
);

/**
 * @route DELETE /tasks/:id
 * @description Delete a task
 * @access Login required
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.deleteSingleTask
);

/**
 * @route GET /tasks/:id
 * @description Get details of a task
 * @access Login require
 */

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.getSingleTask
);

/**
 * @route put /tasks/:id/assign
 * @description // Assign task to user by ID
 * @access Login required
 */

router.put(
  "/:id/assign",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("assignee").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.assignTaskToMember
);
/**
 * @route put /projects/:id/unassign
 * @description // unAssign task from user by ID
 * @access Login required
 */

router.put(
  "/:id/unassign",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("assignee").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.unAssignTaskFromMember
);

/**
 * @route GET /tasks/:id/comments
 * @description get comments of a task
 * @access Login required
 */

router.get(
  "/:id/comments",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  taskController.getCommentsOfTask
);
module.exports = router;
