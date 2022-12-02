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

module.exports = boardsRouter;
