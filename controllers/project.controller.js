const Project = require("../models/Project");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Task = require("../models/Task");

const projectController = {};

const calculateProjectCount = async (userId, field) => {
  try {
    const projectCount = await Project.countDocuments({
      // [field]: { $in: [userId] },
      [field]: userId,
      isDeleted: false,
    });

    // const taskCount = tasks.length;

    console.log(`project count for user ${userId}:`, projectCount);
    await User.findByIdAndUpdate(userId, { projectCount }, { new: true });
  } catch (error) {
    console.error("Error calculating Project count:", error);
    throw new AppError(
      500,
      "Internal server error",
      "Calculate task count error"
    );
  }
};

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

/**
 * @route POST /projects
 * @description Create a new project
 * @body { title, description,Budget, startDate,enddate , createdBy, priority, status }
 * @access login required
 */

projectController.createNewProject = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;
  let {
    title,
    description,
    budget,
    startDate,
    dueDate,
    status,
    manager,
    assignees,
    priority,
  } = req.body;

  //validation
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project create Error"
    );

  if (!startDate) {
    startDate = new Date();
  }
  let start = new Date(startDate);
  let due = new Date(dueDate);

  if (start > due)
    throw new AppError(400, "Start date must be before due date");

  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      const check = await User.find({ _id: assigneeId, isDeleted: false });
      console.log(check);
      if (check.length === 0)
        throw new AppError(404, `Assignee ${assigneeId} not found`);
    }
  }

  assignees.unshift(currentUserId);

  let project = await Project.create({
    title,
    description,
    budget,
    startDate,
    dueDate,
    status,
    manager: currentUserId,
    assignees,
    priority,
  });

  // await calculateProjectCount(currentUserId, "manager");

  // Update project count for each assignee
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateProjectCount(assigneeId, "assignees");
    }
  }
  project = await project.populate("assignees");

  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "create project successfully"
  );
});

/**
 * @route PUT /projects/:id
 * @description Update project/ edit project
 * @body { title, description,Budget, startDate, priority, status}
 * @access login required
 */

projectController.updateProject = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;
  const projectId = req.params.id;
  console.log("first", projectId);
  let {
    title,
    description,
    budget,
    startDate,
    dueDate,
    status,
    manager,
    priority,
    assignees,
  } = req.body;

  //validation

  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  let project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project)
    throw new AppError(400, "The project is not existed", "Edit project error");

  if (!startDate) {
    startDate = project.startDate;
  }
  if (!dueDate) {
    dueDate = project.dueDate;
  }

  let start = new Date(startDate);
  let due = new Date(dueDate);

  if (start > due)
    throw new AppError(400, "Start date must be before due date");

  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      const check = await User.find({ _id: assigneeId, isDeleted: false });
      console.log(check);
      if (check.length === 0)
        throw new AppError(404, `Assignee ${assigneeId} not found`);
    }
  }

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
  // req.body.assignees.unshift(currentUserId);
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  await project.save();
  // Update project count for each assignee
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateProjectCount(assigneeId, "assignees");
    }
  }
  project = await project.populate("assignees");
  project = await project.populate("manager");

  //response
  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "create project successfully"
  );
});

/**
 * @route DELETE /projects/:id
 * @description Delete a project
 * @access login required
 */
projectController.deleteSingleProject = catchAsync(async (req, res, next) => {
  //getdata from req
  const currentUserId = req.userId;
  const currentRole = req.role;
  const targetProjectId = req.params.id;

  //validation
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );
  // process
  const project = await Project.findOneAndUpdate(
    {
      _id: targetProjectId,
      manager: currentUserId,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );

  if (!project)
    throw new AppError(400, "Project not found", "Delete Project Error");

  //delete project also means delete all task belong to the project
  const task = await Task.updateMany(
    { projectId: targetProjectId },
    { $set: { isDeleted: true } },
    { new: true }
  );

  // Update project count for each assignee

  const assignees = project.assignees;
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateProjectCount(assigneeId, "assignees");
    }
  }
  // update taskCount for each assignees
  if (assignees && assignees.length > 0) {
    for (const assigneeId of assignees) {
      await calculateTaskCount(assigneeId, "assignees");
    }
  }

  // await calculateProjectCount(currentUserId, "manager");

  // const assignees = project.assignees;
  // if (assignees && assignees.length > 0) {
  //   for (const assigneeId of assignees) {
  //     await calculateProjectCount(assigneeId, "member");
  //   }
  // }

  //response
  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "Delete Project successfully"
  );
});

/**
 * @route GET /projects/:id
 * @description Get detail of single project
 * @access Login required
 */

projectController.getSingleProject = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const currentRole = req.role;

  const targetProjectId = req.params.id;
  //validation
  // let project = Project.findById(targetProjectId);
  let project = await Project.findOne({
    _id: targetProjectId,
    isDeleted: false,
  });
  if (!project)
    throw new AppError(400, "Project not found", "Get Project Error");

  project = await project.populate("manager");
  project = await project.populate("assignees");

  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "get single project successfully"
  );
});

/**
- @route GET /projects?page=1&limit=10
- @description Get all projects with pagination 
- @access Login required
*/

projectController.getProjects = catchAsync(async (req, res, next) => {
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

  if (
    filter.status &&
    ["pending", "ongoing", "review", "done", "archive"].includes(filter.status)
  ) {
    filterConditions.push({
      status: filter.status,
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Project.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let projects = await Project.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("manager")
    .populate("assignees");

  return sendResponse(
    res,
    200,
    true,
    { projects, totalPages, count },
    null,
    "get users successfull"
  );
});

/**
 * @route put /projects/:id/assign
 * @description // Assign project to user by ID
 * @access Login required
 */

projectController.assignProjectToMember = catchAsync(async (req, res, next) => {
  //getdata from req
  const projectId = req.params.id;
  const { assignee } = req.body;
  const currentRole = req.role;
  const currentUserId = req.userId;
  //validation
  if (currentRole === "member")
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Project update Error"
    );

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project) throw new AppError(404, "Bad request", "Project not found");

  const user = await User.findOne({ _id: assignee, isDeleted: false });
  if (!user) throw new AppError(404, "Bad request", "User doesnot exist");

  if (project.assignees.includes(assignee))
    throw new AppError(
      400,
      "already assigned this user to the project",
      "Assign user to project Error"
    );

  project.assignees.push(assignee);
  await project.save();

  //update projectCount
  await calculateProjectCount(assignee, "assignees");
  sendResponse(res, 200, true, project, null, "Assign Project successfully");
});

/**
 * @route put /projects/:id/assignees
 * @description // Assign project to users by ID
 * @access Login required
 */

projectController.assignProjectToMembers = catchAsync(
  async (req, res, next) => {
    //getdata from req
    const projectId = req.params.id;
    const { assignees } = req.body;
    const currentRole = req.role;
    const currentUserId = req.userId;

    //validation
    if (currentRole === "member")
      throw new AppError(
        403,
        "You do not have permission to perform the action",
        "Project update Error"
      );

    let project = await Project.findOne({ _id: projectId, isDeleted: false });
    if (!project) throw new AppError(404, "Bad request", "Project not found");

    if (assignees && assignees.length > 0) {
      for (const assigneeId of assignees) {
        const check = await User.find({ _id: assigneeId, isDeleted: false });
        console.log(check);
        if (check.length === 0)
          throw new AppError(404, `Assignee ${assigneeId} not found`);
      }
    }

    if (assignees && assignees.length > 0) {
      for (const assigneeId of assignees) {
        const check = project.assignees.includes(assigneeId);
        if (check) {
          throw new AppError(
            404,
            `Assignee ${assigneeId} is already assigned `
          );
        }
      }
    }
    project.assignees.push(...assignees);

    await project.save();

    // Update project count for each assignee
    if (assignees && assignees.length > 0) {
      for (const assigneeId of assignees) {
        await calculateProjectCount(assigneeId, "assignees");
      }
    }
    project = await project.populate("assignees");
    //response
    sendResponse(
      res,
      200,
      true,
      { project },
      null,
      "Assign Project successfully"
    );
  }
);

/**
 * @route put /projects/:id/unassign
 * @description // unAssign project from user by ID
 * @access Login required
 */

projectController.unAssignProjectFromMember = catchAsync(
  async (req, res, next) => {
    //getdata from req
    const projectId = req.params.id;
    const { assignee } = req.body;
    const currentRole = req.role;
    const currentUserId = req.userId;

    //vaildation
    //early exit
    if (currentRole === "member")
      throw new AppError(
        403,
        "You do not have permission to perform the action",
        "Project update Error"
      );

    //hồi đầu sử dụng findByid nhưng mà khi xoá mềm id đó vẫn còn tồn tại nên sử dụng findOne
    let project = await Project.findOne({ _id: projectId, isDeleted: false });
    if (!project) throw new AppError(404, "Bad request", "Project not found");

    const user = await User.findOne({ _id: assignee, isDeleted: false });
    if (!user) throw new AppError(404, "Bad request", "User doesnot exist");

    if (!project.assignees.includes(assignee))
      throw new AppError(
        400,
        "User have not been assigned to this project yet",
        "Unassign user Error"
      );

    const indexOfAssignee = project.assignees.indexOf(assignee);
    if (indexOfAssignee > -1) {
      project.assignees.splice(indexOfAssignee, 1);
    }
    //update projectCount
    await project.save();

    await calculateProjectCount(assignee, "assignees");
    project = await project.populate("assignees");
    sendResponse(
      res,
      200,
      true,
      { project },
      null,
      "UnAssign Project successfully"
    );
  }
);

/**
 * @route GET /projects/:id/tasks
 * @description Get tasks of a projects
 * @access Login required
 */

projectController.getTasksOfProject = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentRole = req.role;
  const projectId = req.params.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project)
    throw new AppError(400, "Project not found", "Get Tasks of Project Error");

  const count = await Task.countDocuments({ projectId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  const tasks = await Task.find({ projectId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { tasks, totalPages, count },
    null,
    "Get tasks successfully"
  );
});

/**
 * @route GET /projects/:id/tasksbystatus
 * @description Get tasks of a projects by status
 * @access Login required
 */

projectController.getTasksOfProjectByStatus = catchAsync(
  async (req, res, next) => {
    //get data
    const currentUserId = req.userId;
    const currentRole = req.role;
    const projectId = req.params.id;

    //validation
    const project = await Project.findOne({ _id: projectId, isDeleted: false });

    if (!project)
      throw new AppError(
        400,
        "Project not found",
        "Get Tasks by status of Project Error"
      );

    const tasks = await Task.find({ projectId, isDeleted: false })
      .sort({
        order: 1,
      })
      .populate("assignees");
    if (!tasks) {
      throw new AppError(
        400,
        "The task has not created yet",
        "Get Tasks by status of Project Error"
      );
    }
    const tasksByStatusCollection = tasks.reduce((acc, task) => {
      const { status } = task;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});

    const defaultValue = {
      pending: [],
      ongoing: [],
      review: [],
      done: [],
      archive: [],
    };

    const tasksByStatus = { ...defaultValue, ...tasksByStatusCollection };
    return sendResponse(
      res,
      200,
      true,
      { tasksByStatus },
      null,
      "Get tasks successfully"
    );
  }
);

projectController.updateTaskStatusAndOrder = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const currentRole = req.role;
    const projectId = req.params.id;
    const { updatedTasks } = req.body;
    console.log("updatedTask", updatedTasks);
    //validation
    const project = await Project.findOne({ _id: projectId, isDeleted: false });

    if (!project)
      throw new AppError(
        400,
        "Project not found",
        "Get Tasks by status of Project Error"
      );
    const bulkOps = updatedTasks?.map((task) => ({
      updateOne: {
        filter: { _id: task._id, projectId },
        update: { $set: { order: task.order, status: task.status } },
      },
    }));

    const tasks = await Task.find({ projectId, isDeleted: false }).sort({
      order: 1,
    });
    if (!tasks) {
      throw new AppError(
        400,
        "The task has not created yet",
        "Get Tasks by status of Project Error"
      );
    }
    const tasksByStatusCollection = tasks.reduce((acc, task) => {
      const { status } = task;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});

    const defaultValue = {
      pending: [],
      ongoing: [],
      review: [],
      done: [],
      archive: [],
    };

    const tasksByStatus = { ...defaultValue, ...tasksByStatusCollection };

    try {
      await Task.bulkWrite(bulkOps);
      sendResponse(
        res,
        200,
        true,
        { tasksByStatus, updatedTasks },
        null,
        "Update tasks successfully"
      );
    } catch (err) {
      throw new AppError(
        400,
        "Tasks reordered and updated fail",
        "Update Tasks status,order of Project Error"
      );
    }
  }
);

module.exports = projectController;
