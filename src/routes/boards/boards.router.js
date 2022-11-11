const express = require("express");
import { createBoard } from "./boards.controllers";

const boardsRouter = express.Router();

boardsRouter.post("/", createBoard);

module.exports = boardsRouter;
