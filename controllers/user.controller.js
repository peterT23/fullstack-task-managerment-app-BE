const User = require("../models/User");
const userController = {};
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcript = require("bcryptjs");
//register user

/**
 * @route POST /users
 * @description Register new user as Manager
 * @body {name, email, password, role}
 * @access Public
 */

userController.register = catchAsync(async (req, res, next) => {
  //getdata from request
  let { name, email, password, role } = req.body;

  //validation
  if (role !== "manager")
    throw new AppError(
      405,
      "Only manager can register account",
      "Registration Error"
    );

  let user = await User.findOne({ email });
  if (user)
    throw new AppError(409, "User already exists", "Registration Error");

  //processing
  const salt = await bcript.genSalt(10);
  password = await bcript.hash(password, salt);
  user = await User.create({ name, email, password, role });
  //response
  const accessToken = await user.generateToken();

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Register user successful"
  );
});

/**
 * @route POST /users/member
 * @description Register new user for team member. only manager can do
 * @body {name, email, password, role}
 * @access Public
 */

userController.createMemberAccount = catchAsync(async (req, res, next) => {
  //getdata from request
  let { name, email, password, role } = req.body;
  const currentUserId = req.userId;
  const currentRole = req.role;

  //validation
  if (currentRole !== "manager")
    throw new AppError(
      405,
      "Only manager can create account for member",
      "Registration Error"
    );

  let user = await User.findOne({ email });
  if (user)
    throw new AppError(409, "User already exists", "Registration Error");
  //process
  const salt = await bcript.genSalt(10);
  password = await bcript.hash(password, salt);

  user = await User.create({ name, email, password, role });

  //response
  sendResponse(res, 200, true, { user }, null, "Register user successful");
});

// /**
// - @route GET /users/me
// - @description Get current user info
// - @access Login required
// */

// userController.getCurrentUser = catchAsync(async (req, res, next) => {
//   // get data from request
//   const currentUserId = req.userId;
//   const user = await User.findOne({ _id: currentUserId, isDeleted: false });

//   //validation

//   if (!user)
//     throw new AppError(400, "User not found", "Get current User Error");

//   // process

//   //response
//   return sendResponse(
//     res,
//     200,
//     true,
//     user,
//     null,
//     "Get current user successful"
//   );
// });

/**
- @route GET /users/:id
- @description Get a user profile
- @access Login required
*/

userController.getSingleUser = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const targetUserId = req.params.id;

  //validation

  let user = await User.findOne({ _id: targetUserId, isDeleted: false });
  if (!user) throw new AppError(400, "User not found", "Get single User Error");

  // process
  user = user.toJSON();

  //response

  return sendResponse(res, 200, true, user, null, "Get single user successful");
});

// /**
// - @route PUT /users/:id
// - @description Update user profile (edit user profile)
// - @body { name, avatarUrl, shortDescription, Phone ,Skills, Strength , Languages , jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
// - @access Login required
// */

// userController.updateUserProfile = catchAsync(async (req, res, next) => {
//   // get data from request
//   const currentUserId = req.userId;
//   const targerUserId = req.params.id;

//   //validation

//   if (currentUserId !== targerUserId)
//     throw new AppError(400, "permission required", " Update User Error"); ///// k can thiet chinh lai router

//   let user = await User.findOne({ _id: targerUserId, isDeleted: false });
//   if (!user) throw new AppError(400, "User not found", "Update User Error");
//   // process

//   const allow = [
//     "name",
//     "avatarUrl",
//     "description",
//     "languages",
//     "facebookLink",
//     "linkedinLink",
//     "twitterLink",
//     "phone",
//   ];

//   const updateUserField = Object.keys(req.body);
//   updateUserField.forEach((updateField) => {
//     if (!allow.includes(updateField))
//       throw new AppError(
//         404,
//         `The update data ${updateField} is not correct`,
//         "Update user fail"
//       );
//   });

//   allow.forEach((field) => {
//     if (req.body[field] !== undefined) {
//       user[field] = req.body[field];
//     }
//   });

//   await user.save();

//   //response
//   return sendResponse(res, 200, true, user, null, "Update user successful");
// });

/**
 * @route GET /users?page=1&limit=10
 * @description Get user with page and limit and search by name
 * @access Login required
 */
userController.getUsers = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;

  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page);
  limit = parseInt(limit);
  //validation
  const filterConditions = [{ isDeleted: false }];

  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" }, //case sensitive
    });
  }
  // process
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);

  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  //response
  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count },
    null,
    "get users successfull"
  );
});

/**

- @route Delete /users/:id
- @description delete user(member) 
- @access Login required
*/

userController.deleteUser = catchAsync(async (req, res, next) => {
  //getdata from req
  const currentUserId = req.user;
  const currentRole = req.role;
  const targetUserId = req.params.id;
  //validation

  //admin can delete manager and member. manager can delete member , otherwise not

  ///
  if (currentRole === "member")
    throw new AppError(
      403,
      "Do not have permission to perform the action",
      "Delete User Error"
    );

  const targetUser = await User.findOne({
    _id: targetUserId,
    isDeleted: false,
  });

  if (!targetUser)
    throw new AppError(400, "User not found", "Delete User Error");

  if (
    currentRole === "admin" ||
    (currentRole === "manager" && targetUser.role === "member")
  ) {
    targetUser.isDeleted = true;
    await targetUser.save();
    return sendResponse(
      res,
      200,
      true,
      targetUser,
      null,
      "Delete users successful"
    );
  } else {
    throw new AppError(
      403,
      "you do not have permission to delete this user",
      "Delete user error"
    );
  }
});
module.exports = userController;
