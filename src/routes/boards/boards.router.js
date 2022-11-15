const express = require("express");
const { createBoard, getBoards, getBoard, deleteBoard } = require("./boards.controllers");

const boardsRouter = express.Router();
const auth = require("../../middleware/Auth");

boardsRouter.post("/", createBoard);
boardsRouter.get("/", auth, getBoards);
boardsRouter.get("/:id", auth, getBoard);
boardsRouter.delete("/:id", auth, deleteBoard);

module.exports = boardsRouter;
