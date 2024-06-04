const mongoose = require("mongoose");

const userTasksSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide the user id"],
      ref: "user",
    },
    tasks: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          required: [true, "Please provide the task id"],
          unique: true,
        },
        title: {
          type: String,
          required: [true, "Please enter the task title"],
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserTasks = mongoose.model("userTask", userTasksSchema);

module.exports = UserTasks;
