const express = require("express");
const {
  createBoard,
  getBoards,
  getBoard,
  deleteBoard,
  createTask,
  deleteTask,
  updateBoard,
  updateTask,
  updateSubtask,
} = require("./boards.controllers");

const boardsRouter = express.Router();
const auth = require("../../middleware/Auth");

boardsRouter.post("/", createBoard);
boardsRouter.get("/", auth, getBoards);
boardsRouter.get("/:id", auth, getBoard);
boardsRouter.delete("/:id", auth, deleteBoard);
boardsRouter.post("/:id/task", auth, createTask);
boardsRouter.delete("/task/:id", deleteTask);
boardsRouter.put("/:id", updateBoard);
boardsRouter.put("/task/:id", updateTask);
boardsRouter.put("/subtask/:id", updateSubtask);

module.exports = boardsRouter;
