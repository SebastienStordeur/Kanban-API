const express = require("express");
const { createBoard } = require("./boards.controllers");

const boardsRouter = express.Router();

boardsRouter.post("/", createBoard);

module.exports = boardsRouter;
