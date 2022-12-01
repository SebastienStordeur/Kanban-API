const express = require("express");

const {
  httpCreateTask,
  /*deleteTask,
  updateTask,
  updateSubtask,*/
} = require("./tasks.controller");

const tasksRouter = express.Router();
const auth = require("../../middleware/Auth");

tasksRouter.post("/", auth, httpCreateTask);
/*tasksRouter.delete("/:id", auth, deleteTask);
tasksRouter.put("/:id", auth, updateTask);
tasksRouter.put("/subtask/:id", auth, updateSubtask); */

module.exports = tasksRouter;
