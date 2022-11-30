/* const express = require("express");

const {
  createTask,
  deleteTask,
  updateTask,
  updateSubtask,
} = require("./tasks.controller");

const tasksRouter = express.Router();
const auth = require("../../middleware/Auth");

tasksRouter.post("/", auth, createTask);
tasksRouter.delete("/:id", auth, deleteTask);
tasksRouter.put("/:id", auth, updateTask);
tasksRouter.put("/subtask/:id", auth, updateSubtask);

module.exports = tasksRouter;
 */
