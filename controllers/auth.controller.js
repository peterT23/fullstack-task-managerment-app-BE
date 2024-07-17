const User = require("../models/User");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcript = require("bcryptjs");
const authController = {};

//register user

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  //getdata from request
  const { email, password } = req.body;

  //validation

  const user = await User.findOne({ email }, "+password");
  if (!user)
    throw new AppError(400, "Invalid Email or Password", "Login Error");
  //process
  // bcript will check human typed password with the password in database and compare it
  const isMatch = await bcript.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
  const accessToken = await user.generateToken();

  //response

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successfull"
  );
});

module.exports = authController;
