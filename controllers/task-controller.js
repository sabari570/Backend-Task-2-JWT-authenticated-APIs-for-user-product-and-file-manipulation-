const mongoose = require("mongoose");
const UserTasks = require("../models/user-tasks-model");

// controller for creating a product
module.exports.createTask = async (req, res) => {
  const { title } = req.body;
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    if (!title)
      throw { statusCode: 400, message: "Please enter the task title" };

    // creating a random Object id for the product
    const taskId = new mongoose.Types.ObjectId();

    const newTask = {
      _id: taskId,
      title,
    };
    // Checking if their is an already existing product for that user
    let userTasks = await UserTasks.findOne({ userId });

    if (userTasks) {
      await UserTasks.updateOne(
        { userId },
        {
          $push: { tasks: newTask },
        }
      );
    } else {
      await UserTasks.create({
        userId,
        tasks: [newTask],
      });
    }
    return res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.log("Error while creating a task: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for fetching the products
module.exports.fetchTasks = async (req, res) => {
  const userId = req.userId;
  try {
    let userTasks = await UserTasks.findOne({ userId });
    if (!userTasks)
      throw {
        statusCode: 404,
        message: "This user has not created a task yet",
      };
    return res.status(200).json({ tasks: userTasks.tasks.reverse() });
  } catch (err) {
    console.log("Error while fetching the tasks: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for fetching a single product by taskId
module.exports.fetchTaskById = async (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    const userTasks = await UserTasks.findOne({ userId });
    if (!userTasks)
      throw {
        statusCode: 404,
        message: "This user has not created a task yet",
      };

    let task = userTasks.tasks.find((task) => task._id.toString() === taskId);
    if (!task) throw { statusCode: 404, message: "Task not found" };

    return res.status(200).json({ task });
  } catch (err) {
    console.log("Error while fetching the task by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for updating a single product by taskId
module.exports.updateTaskById = async (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  const { title, isCompleted } = req.body;
  try {
    if (!title)
      throw { statusCode: 400, message: "Please enter the task title" };
    if (!isCompleted)
      throw {
        statusCode: 400,
        message: "Please specify the task completion status",
      };

    const userTasks = await UserTasks.findOne({ userId });
    if (!userTasks)
      throw {
        statusCode: 404,
        message: "This user has not created a task yet",
      };

    const updatedUserTask = await UserTasks.findOneAndUpdate(
      {
        userId,
        "tasks._id": taskId,
      },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.isCompleted": isCompleted,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedUserTask) throw { statusCode: 404, message: "Task not found" };

    const task = updatedUserTask.tasks.find((task) => task._id == taskId);
    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.log("Error while updating the task by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for deleting a product by taskId
module.exports.deleteTaskById = async (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    const userTasks = await UserTasks.findOne({ userId });
    if (!userTasks)
      throw {
        statusCode: 404,
        message: "This user has not created a task yet",
      };

    const deletedUserTask = await UserTasks.findOneAndUpdate(
      { userId, "tasks._id": taskId },
      {
        $pull: {
          tasks: {
            _id: taskId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!deletedUserTask) throw { statusCode: 404, message: "Task not found" };

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log("Error while deleting the task by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
