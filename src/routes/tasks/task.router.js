const express = require("express");

const {
  httpCreateTask,
  httpDeleteTask,
  /*httpUpdateTask,
  httpUpdateSubtask,*/
} = require("./tasks.controller");

const tasksRouter = express.Router();
const auth = require("../../middleware/Auth");

tasksRouter.post("/", auth, httpCreateTask);
tasksRouter.delete("/:id", auth, httpDeleteTask);
/*tasksRouter.put("/:id", auth, updateTask);
tasksRouter.put("/subtask/:id", auth, updateSubtask); */

module.exports = tasksRouter;
