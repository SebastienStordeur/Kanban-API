const express = require("express");
const { createBoard, getBoards, getBoard, deleteBoard, createTask } = require("./boards.controllers");

const boardsRouter = express.Router();
const auth = require("../../middleware/Auth");

boardsRouter.post("/", auth, createBoard);
boardsRouter.get("/", auth, getBoards);
boardsRouter.get("/:id", auth, getBoard);
boardsRouter.delete("/:id", auth, deleteBoard);
boardsRouter.post("/:id/task", createTask);

module.exports = boardsRouter;
