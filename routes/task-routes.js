const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const {
  createTask,
  fetchTasks,
  fetchTaskById,
  updateTaskById,
  deleteTaskById
} = require("../controllers/task-controller");

const router = Router();

// route for creating a product
router.post("/create-task", authMiddleware, createTask);

// route for fetching the user products
router.get("/fetch-tasks", authMiddleware, fetchTasks);

// route for fetching a single product
router.get("/fetch-task/:id", authMiddleware, fetchTaskById);

// route for updating a product
router.put("/update-task/:id", authMiddleware, updateTaskById);

// route for deleting a product
router.delete("/delete-task/:id", authMiddleware, deleteTaskById);

module.exports = router;
