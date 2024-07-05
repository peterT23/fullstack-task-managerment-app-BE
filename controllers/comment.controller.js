const Comment = require("../models/Comment");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Task = require("../models/Task");

const commentController = {};
//register user

const calculateCommentInTask = async (taskId) => {
  const commentCount = await Comment.countDocuments({
    taskId,
    isDeleted: false,
  });

  console.log(commentCount);
  await Task.findByIdAndUpdate(taskId, { commentCount }, { new: true });
};
/**
 * @route POST /comments
 * @description create new comments
 * @body {comment, commentDate, TaskID, commentUser}
 * @access Login required
 */

commentController.createNewComment = catchAsync(async (req, res, next) => {
  //get data from req
  const currentUserId = req.userId;
  const { taskId, content } = req.body;

  //validation
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) throw new AppError(400, "Task not found", "Create comment error");

  // create new comment
  let comment = await Comment.create({
    commentUser: currentUserId,
    content,
    taskId,
  });

  // update comment count of the post
  await calculateCommentInTask(taskId);
  comment = await comment.populate("commentUser");
  //response
  sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "Create new comment successfull"
  );
});

/**
 * @route PUT /comments/:id
 * @description edit comment
 * @body {comment, commentDate}
 * @access Login required
 */

commentController.editComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const currentRole = req.role;
  const commentId = req.params.id;
  let { content } = req.body;

  //validation
  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment)
    throw new AppError(400, "The comment is not exist", "Edit comment error");

  if (!currentUserId === comment.commentUser)
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Edit comment Error"
    );
  if (content !== undefined) {
    comment.content = content;
  }

  await comment.save();
  comment = await comment.populate("taskId");

  //response
  return sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "edit comment successfully"
  );
});
/**
 * @route DELETE /comments/:id
 * @description delete comment
 * @access Login required
 */

commentController.deleteComment = catchAsync(async (req, res, next) => {
  //getdata from req

  const currentUserId = req.userId;
  const currentRole = req.role;
  const commentId = req.params.id;

  // validation

  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment)
    throw new AppError(400, "The comment is not exist", "Edit comment error");

  if (!currentUserId === comment.commentUser)
    throw new AppError(
      403,
      "You do not have permission to perform the action",
      "Delete comment Error"
    );

  comment = await Comment.findByIdAndUpdate(
    commentId,
    { isDeleted: true },
    { new: true }
  );

  //response
  return sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "Delete comment successfully"
  );
});
/**
 * @route GET /comments/:id
 * @description get details of comment
 * @access Login required
 */

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  //getdata from req

  const currentUserId = req.userId;
  const currentRole = req.role;
  const commentId = req.params.id;

  // validation

  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment)
    throw new AppError(400, "The comment is not exist", "Edit comment error");

  //
  return sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "Get comment successfully"
  );
});

module.exports = commentController;
