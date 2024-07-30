const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatarUrl: { type: String, required: false, default: "" },
    role: {
      type: String,
      required: true,
      enum: ["manager", "member", "admin"],
    },
    jobTitle: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    languages: { type: String, required: false, default: "" },

    facebookLink: { type: String, require: false, default: "" },
    linkedinLink: { type: String, require: false, default: "" },
    twitterLink: { type: String, require: false, default: "" },
    phone: { type: Number, required: false, default: 0 },

    projectCount: { type: Number, default: 0 },
    taskCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
    // isActive: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

//this function will be called when ever we use method to switch data to Json . before return the data object to client we need to adjust the raw document. EX : we need to delete sensitive password and isDeleted field to secure the userdata.
userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign(
    { _id: this._id, role: this.role },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
