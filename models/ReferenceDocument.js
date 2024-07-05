const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referenceSchema = Schema(
  {
    name: { type: String, required: true },
    targetType: { type: String, required: true, enum: ["TaskID", "CommentID"] },
    targetId: {
      type: Schema.ObjectId,
      required: true,
      refPath: "targetType",
    },
    referenceDocument: { type: String, required: true },
  },
  { timestamps: true }
);

const Reference = mongoose.model("Reference", referenceSchema);
module.exports = Reference;
