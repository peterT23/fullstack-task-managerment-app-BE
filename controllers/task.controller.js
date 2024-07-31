const Task = require("../models/Task");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");

const taskController = {};

const calculateTaskCount = async (userId, field) => {
  try {
    const taskCount = await Task.countDocuments({
      // [field]: { $in: [userId] },
      [field]: userId,
      isDeleted: false,
    });

    // const taskCount = tasks.length;

    console.log(`Task count for user ${userId}:`, taskCount);
    await User.findByIdAndUpdate(userId, { taskCount }, { new: true });
  } catch (error) {
    console.error("Error calculating task count:", error);
    throw new AppError(
      500,
      "Internal server error",
      "Calculate task count error"
    );
  }
};

const calculateTaskInProject = async (projectId) => {
  const taskCount = await Task.countDocuments({
    projectId,
    isDeleted: false,
  });
  await Project.findByIdAndUpdate(projectId, { taskCount }, { new: true });
};

/**
 * @route GET /tasks?page=1&limit=10
 * @description Get tasks
 * @access Login required
 */

taskController.getTasks = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];

  if (filter.title) {
    filterConditions.push({
      title: { $regex: filter.title, $options: "i" }, //case sensitive
    });
  }

  // if (
  //   filter.status &&
  //   ["pending", "ongoing", "review", "done", "archive"].includes(filter.status)
  // ) {
  //   filterConditions.push({
  //     status: filter.status,
  //   });
  // }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Task.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let tasks = await Task.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("assignees")
    .populate("projectId");

  return sendResponse(
    res,
    200,
    true,
    { tasks, totalPages, count },
    null,
    "get users successfull"
  );
});

/**
 * @route POST /tasks
 * @description create a new task
 * @body { title, description, startdate,enddate, status, projectID, createdBy, AssignedTo ,priority }
 * @access Login required
 */

taskController.createNewTask = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;
  let {
    title,
    description,
    startDate,
    dueDate,
    status,
    projectId,
    assignees,
    priority,
  } = req.body;

  //validation
  //early exit
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project create Error"
    );

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project)
    throw new AppError(400, "Project not found", "Create task error");

  assignees.forEach((assignee) => {
    if (!project.assignees.includes(assignee)) {
      throw new AppError(
        400,
        `You must assign this user  ${assignee} to project first`,
        "Create task error"
      );
    }
  });

  if (!startDate) {
    startDate = new Date();
  }
  let start = new Date(startDate);
  let due = new Date(dueDate);

  if (start > due)
    throw new AppError(400, "Start date must be before due date");

  const pendingTasks = await Task.find({
    status: "pending",
    projectId,
    isDeleted: false,
  })
    .sort({ order: -1 })
    .limit(1);

  const order = pendingTasks.length > 0 ? pendingTasks[0].order + 1 : 1;

  let task = await Task.create({
    title,
    description,
    startDate,
    dueDate,
    status,
    assignees,
    order,
    priority,
    projectId,
  });

  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateTaskCount(assigneeId, "assignees");
    }
  }

  await calculateTaskInProject(projectId);

  task = await task.populate("projectId");
  task = await task.populate("assignees");

  return sendResponse(
    res,
    200,
    true,
    { task },
    null,
    "create task successfully"
  );
});

/**
 * @route PUT /tasks/:id
 * @description Update a task/edit task
 *{ title, description, startdate,enddate, status, createdBy, AssignedTo , priority}
 * @access Login required
 */

taskController.updateTask = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;
  const taskId = req.params.id;
  let { title, description, startDate, dueDate, status, priority, assignees } =
    req.body;

  //validation
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task)
    throw new AppError(400, "The Task is not exist", "Edit Task error");

  const projectId = task.projectId;
  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project)
    throw new AppError(400, "Project not found", "Create task error");

  assignees.forEach((assignee) => {
    if (!project.assignees.includes(assignee)) {
      throw new AppError(
        400,
        `You must assign this user  ${assignee} to project first`,
        "Update task error"
      );
    }
  });

  if (!startDate) {
    startDate = task.startDate;
  }
  if (!dueDate) {
    dueDate = task.dueDate;
  }

  let start = new Date(startDate);
  let due = new Date(dueDate);

  if (start > due)
    throw new AppError(400, "Start date must be before due date");

  // if (assignees && assignees.length > 0) {
  //   for (const assigneeId of assignees) {
  //     const check = await User.find({ _id: assigneeId, isDeleted: false });

  //     if (check.length === 0)
  //       throw new AppError(404, `Assignee ${assigneeId} not found`);
  //   }
  // }
  //process
  const allows = [
    "title",
    "description",
    "budget",
    "startDate",
    "dueDate",
    "status",
    "priority",
    "assignees",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });
  await task.save();
  //update taskCount for each assignee
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateTaskCount(assigneeId, "assignees");
    }
  }
  await task.populate("assignees");
  await task.populate("projectId");

  //response
  return sendResponse(res, 200, true, { task }, null, "edit task successfully");
});

/**
 * @route DELETE /tasks/:id
 * @description Delete a task
 * @access Login required
 */

taskController.deleteSingleTask = catchAsync(async (req, res, next) => {
  //getdata from req

  const currentUserId = req.userId;
  const currentRole = req.role;
  const targetTaskId = req.params.id;

  //validation
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  const task = await Task.findOneAndUpdate(
    {
      _id: targetTaskId,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );

  if (!task) throw new AppError(400, "Task not found", "Delete Task Error");

  //delete task also means delete all comment belong to the task
  const comment = await Comment.updateMany(
    { taskId: targetTaskId },
    { $set: { isDeleted: true } },
    { new: true }
  );

  // update taskCount for each assignees
  const assignees = task.assignees;
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateTaskCount(assigneeId, "assignees");
    }
  }

  //update taskCount in project
  const projectId = task.projectId;
  await calculateTaskInProject(projectId);

  //Update order of remaining tasks in the same project and status
  const tasksToUpdate = await Task.find({
    projectId: projectId,
    status: task.status,
    isDeleted: false,
  }).sort("order");

  //khôg dùng được forEach vì await chỉ để trong async function
  for (let i = 0; i < tasksToUpdate.length; i++) {
    tasksToUpdate[i].order = i + 1;
    await tasksToUpdate[i].save();
  }

  //response
  return sendResponse(
    res,
    200,
    true,
    { task },
    null,
    "Delete Task successfully"
  );
});
/**
 * @route GET /tasks/:id
 * @description Get details of a task
 * @access Login require
 */
taskController.getSingleTask = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;

  const targetTaskId = req.params.id;

  //validation
  let task = await Task.findOne({ _id: targetTaskId, isDeleted: false });

  if (!task) throw new AppError(400, "Task not found", "Get Task Error");
  task = await task.populate("projectId");
  task = await task.populate("assignees");

  //response
  return sendResponse(
    res,
    200,
    true,
    { task },
    null,
    "get single task successfully"
  );
});

/**
 * @route put /tasks/:id/assign
 * @description // Assign task to user by ID
 * @access Login required
 */

taskController.assignTaskToMember = catchAsync(async (req, res, next) => {
  //get data from req
  const taskId = req.params.id;
  const { assignee } = req.body;
  const currentRole = req.role;
  const currentUserId = req.userId;
  //validation
  //early access
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) throw new AppError(404, "Bad request", "Project not found");

  const project = await Project.findOne({
    _id: task.projectId,
    isDeleted: false,
  });
  // if (!project)
  //   throw new AppError(400, "Project not found", "Create task error");

  const user = await User.findOne({ _id: assignee, isDeleted: false });
  if (!user) throw new AppError(404, "Bad request", "User doesnot exist");

  if (!project.assignees.includes(assignee)) {
    throw new AppError(
      400,
      `You must assign this user  ${assignee} to project first`,
      "Create task error"
    );
  }

  if (task.assignees.includes(assignee))
    throw new AppError(
      400,
      "already assigned this user to the task",
      "Assign user to task Error"
    );

  task.assignees.push(assignee);

  await task.save();

  //update taskCount
  await calculateTaskCount(assignee, "assignees");

  sendResponse(res, 200, true, { task }, null, "Assign Task successfully");
});
/**
 * @route put /tasks/:id/unassign
 * @description // unAssign task from user by ID
 * @access Login required
 */

taskController.unAssignTaskFromMember = catchAsync(async (req, res, next) => {
  //get data from req
  const taskId = req.params.id;
  const { assignee } = req.body;
  const currentRole = req.role;
  const currentUserId = req.userId;

  //validation
  //early access
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) throw new AppError(404, "Bad request", "Task not found");

  const user = await User.findOne({ _id: assignee, isDeleted: false });
  if (!user) throw new AppError(404, "Bad request", "User doesnot exist");

  if (!task.assignees.includes(assignee))
    throw new AppError(
      400,
      "User have not been assigned to this task yet",
      "Unassign user Error"
    );
  const indexOfAssignee = task.assignees.indexOf(assignee);
  if (indexOfAssignee > -1) {
    task.assignees.splice(indexOfAssignee, 1);
  }

  await task.save();
  //update taskCount
  await calculateTaskCount(assignee, "assignees");

  sendResponse(res, 200, true, { task }, null, "UnAssign task successfully");
});

/**
 * @route GET /tasks/:id/comments
 * @description get comments of a task
 * @access Login required
 */
taskController.getCommentsOfTask = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentRole = req.role;
  const taskId = req.params.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const task = await Task.findOne({ _id: taskId, isDeleted: false });

  if (!task)
    throw new AppError(400, "Task not found", "Get comments of Task Error");

  const count = await Comment.countDocuments({ taskId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  const comments = await Comment.find({ taskId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("commentUser");

  return sendResponse(
    res,
    200,
    true,
    { comments, totalPages, count },
    null,
    "Get comments successfully"
  );
});
module.exports = taskController;
