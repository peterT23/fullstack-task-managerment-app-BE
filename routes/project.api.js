const express = require("express");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const projectController = require("../controllers/project.controller");
const router = express.Router();

// <!-- the actions related directly to edit, create, delete must be handle by manager -->

/**
 * @route POST /projects
 * @description Create a new project
 * @body { title, description,Budget, startDate,enddate , createdBy, priority, status }
 * @access login required
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
    body("budget")
      .optional()
      .isNumeric()
      .withMessage("Budget must be a number"),
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
      .default("pending")
      .isIn(["pending", "ongoing", "review", "done", "archive"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .default("low")
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
  ]),
  projectController.createNewProject
);

// <!-- project should be updated by manager -->

/**
 * @route PUT /projects/:id
 * @description Update project/ edit project
 * @body { title, description,Budget, startDate, priority, status}
 * @access login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    body("title", "Missing title")
      .optional()
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("budget")
      .optional()
      .isNumeric()
      .withMessage("Budget must be a number"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date"),
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
  projectController.updateProject
);
/**
 * @route DELETE /projects/:id
 * @description Delete a project
 * @access login required
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.deleteSingleProject
);
/**
 * @route GET /projects/:id
 * @description Get detail of single project
 * @access Login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.getSingleProject
);

/**
- @route GET /projects?page=1&limit=10
- @description Get all projects with pagination 
- @access Login required
*/
router.get("/", authentication.loginRequired, projectController.getProjects);

/**
 * @route put /projects/:id/assign
 * @description // Assign project to user by ID
 * @access Login required
 */

router.put(
  "/:id/assign",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("assignee").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.assignProjectToMember
);
/**
 * @route put /projects/:id/assignees
 * @description // Assign project to users by ID
 * @access Login required
 */
router.put(
  "/:id/assignees",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("assignees")
      .exists()
      .isArray()
      .custom((value) => {
        if (!Array.isArray(value)) {
          throw new Error("Assignees must be an array");
        }
        value.forEach((id) => validators.checkObjectId(id));
        return true;
      }),
  ]),
  projectController.assignProjectToMembers
);

/**
 * @route put /projects/:id/unassign
 * @description // unAssign project from user by ID
 * @access Login required
 */
router.put(
  "/:id/unassign",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("assignee").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.unAssignProjectFromMember
);

/**
 * @route GET /projects/:id/tasks
 * @description Get tasks of a projects
 * @access Login required
 */

router.get(
  "/:id/tasks",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.getTasksOfProject
);
/**
 * @route GET /projects/:id/tasks/status
 * @description Get tasks of a projects
 * @access Login required
 */

router.get(
  "/:id/tasks/status",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.getTasksOfProjectByStatus
);

/**
 * @route PUT /projects/:id/tasks/reorder
 * @description update  task order, task status  of a projects
 * @access Login required
 */

router.put(
  "/:id/tasks/reorder",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    // body("updatedTask").exists().isString().custom(validators.checkObjectId),
  ]),
  projectController.updateTaskStatusAndOrder
);

module.exports = router;
