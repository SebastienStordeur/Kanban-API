const express = require("express");
const {
  httpCreateBoard,
  httpGetBoards,
  httpGetBoard,
  httpDeleteBoard,
  httpUpdateBoard,
} = require("./boards.controller");

const boardsRouter = express.Router();
const auth = require("../../middleware/Auth");

boardsRouter.post("/", auth, httpCreateBoard);
boardsRouter.get("/", auth, httpGetBoards);
boardsRouter.get("/:id", auth, httpGetBoard);
boardsRouter.delete("/:id", auth, httpDeleteBoard);
boardsRouter.put("/:id", auth, httpUpdateBoard);

/* boardsRouter.post("/:id/task", auth, createTask);
boardsRouter.delete("/task/:id", auth, deleteTask); */

/* boardsRouter.put("/task/:id", auth, updateTask);
boardsRouter.put("/subtask/:id", auth, updateSubtask); */

module.exports = boardsRouter;
