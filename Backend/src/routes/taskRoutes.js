const express = require("express");
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignUserToTask,
  removeUserFromTask,
} = require("../controllers/taskController");

const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(authMiddleware);

router.post("/", createTask); //
router.get("/project/:projectId", getProjectTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:taskId/assign", authMiddleware, assignUserToTask);
router.delete("/:taskId/users/:userId", authMiddleware, removeUserFromTask);

module.exports = router;
