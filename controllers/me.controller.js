const User = require("../models/User");
const userController = {};
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcript = require("bcryptjs");

const meController = {};
meController.getCurrentUser = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const user = await User.findOne({ _id: currentUserId, isDeleted: false });

  //validation

  if (!user)
    throw new AppError(400, "User not found", "Get current User Error");

  // process

  //response
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});

meController.updateMeProfile = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const userId = req.params.id;

  //validation

  if (currentUserId !== userId)
    throw new AppError(
      400,
      "You do not have permission to perform this action"
    );

  let user = await User.findOne({ _id: currentUserId, isDeleted: false });
  if (!user) throw new AppError(400, "User not found", "Update User Error");
  // process

  const allow = [
    "name",
    "avatarUrl",
    "description",
    "languages",
    "facebookLink",
    "linkedinLink",
    "twitterLink",
    "phone",
    "jobTitle",
  ];

  const updateUserField = Object.keys(req.body);
  updateUserField.forEach((updateField) => {
    if (!allow.includes(updateField))
      throw new AppError(
        404,
        `The update data ${updateField} is not correct`,
        "Update user fail"
      );
  });

  allow.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  //response
  return sendResponse(res, 200, true, user, null, "Update profile successful");
});

module.exports = meController;
