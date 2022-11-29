const express = require("express");
const {
  createBoard,
  getBoards,
  getBoard,
  deleteBoard,
  updateBoard,
} = require("./boards.controller");

const boardsRouter = express.Router();
const auth = require("../../middleware/Auth");

boardsRouter.post("/", createBoard);
boardsRouter.get("/", auth, getBoards);
boardsRouter.get("/:id", auth, getBoard);
boardsRouter.delete("/:id", auth, deleteBoard);
/* boardsRouter.post("/:id/task", auth, createTask);
boardsRouter.delete("/task/:id", auth, deleteTask); */
boardsRouter.put("/:id", auth, updateBoard);
/* boardsRouter.put("/task/:id", auth, updateTask);
boardsRouter.put("/subtask/:id", auth, updateSubtask); */

module.exports = boardsRouter;
