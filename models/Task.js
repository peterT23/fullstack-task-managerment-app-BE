const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "ongoing", "review", "done", "archive"],
    },
    priority: {
      type: String,
      default: "low",
      enum: ["low", "medium", "high"],
    },
    projectId: { type: Schema.ObjectId, required: true, ref: "Project" },
    assignees: [{ type: Schema.ObjectId, required: true, ref: "User" }],
    order: { type: Number },
    commentCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
