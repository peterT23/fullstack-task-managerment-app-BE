const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    budget: { type: Number, default: 0 },
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
    manager: { type: Schema.ObjectId, required: true, ref: "User" },
    assignees: [{ type: Schema.ObjectId, ref: "User" }],
    taskCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
