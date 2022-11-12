const express = require("express");
const { createBoard, getBoards, getBoard } = require("./boards.controllers");

const boardsRouter = express.Router();

boardsRouter.post("/", createBoard);
boardsRouter.get("/", getBoards);
boardsRouter.get("/:id", getBoard);

module.exports = boardsRouter;
