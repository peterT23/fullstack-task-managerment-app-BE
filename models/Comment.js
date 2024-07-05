const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    content: { type: String, required: true },
    taskId: { type: Schema.ObjectId, required: true, ref: "Task" },
    commentUser: { type: Schema.ObjectId, required: true, ref: "User" },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
