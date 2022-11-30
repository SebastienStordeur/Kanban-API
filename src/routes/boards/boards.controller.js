const { v4 } = require("uuid");
const { getId } = require("../../services/authService");
const {
  validationColumns,
  validationTitle,
} = require("../../services/validations/createBoard.validation");

const mongoose = require("mongoose");

const Board = require("../../models/boards/boards.mongo");

async function httpCreateBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    /*  const boardId = v4();
    const columns = []; */

    /*     const createBoard = prisma.board.create({
      data: { id: boardId, title: req.body.title, userId },
    });
    const createColumns = prisma.column.createMany({ data: columns }); */

    //Premiere transaction creation de board
    //Puis creation des colonnes
    //Puis push l'id dans le tableau de board de l'utilisateur

    const createBoard = "";
    /* 
    validationTitle(req.body.title, res);
    validationColumns(req.body.columns, columns, boardId); */

    const board = new Board({
      title: req.body.title,
      userId,
    });

    board
      .save()
      .then((board) => {
        return res.status(201).json({ id: board._id, title: board.title });
      })
      .catch((err) => {
        return res.status(500).json(`${err}`);
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function getBoards(req, res) {
  const authServiceResponse = await getId(req);
  const userId = authServiceResponse.id;

  await Board.find({ userId }, (err, docs) => {
    if (!err) {
      return res.status(200).json(docs);
    } else {
      return res.status(500).json(err);
    }
  });
}

async function getBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.params.id || req.body.boardId;
    const board = await Board.findById(boardId);

    if (board.userId === userId) {
      return res.status(200).json(board);
    } else {
      return res.status(403).json({
        status: 403,
        error: "You are not allowed to see this board",
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteBoard(req, res) {
  try {
    const boardId = req.params.id;
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const board = await Board.findById(boardId);

    if (board.userId === userId) {
      await board
        .deleteOne({ _id: boardId })
        .then(() => {
          return res.status(200).json({ status: 200, success: true });
        })
        .catch(() => {
          return res.status(500).json({
            status: 500,
            error: "We couldn't delete this board. Try again later.",
          });
        });
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function updateBoard(req, res) {
  try {
    /* const authServiceResponse = await getId(req); */
    /* const userId = authServiceResponse.id; */

    const boardId = req.body.id;
    const columns = req.body.columns;

    await prisma.board
      .update({
        where: { id: req.body.id },
        data: { title: req.body.title },
      })
      .then(async () => {
        for (const column of columns) {
          if (column.id) {
            await prisma.column.update({
              where: { id: column.id },
              data: { column: column.column },
            });
          } else {
            await prisma.column.create({
              data: {
                column: column.column,
                boardId,
              },
            });
          }

          /*             .then((response) => res.status(200).json(response))
            .catch((err) => res.status(500).json(err)); */
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "error", err });
      });
  } catch (err) {
    console.error("ERROR", err);
  }
}

module.exports = {
  httpCreateBoard,
  getBoards,
  getBoard,
  deleteBoard,
  updateBoard,
};
