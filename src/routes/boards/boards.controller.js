const { PrismaClient } = require("@prisma/client");
const { v4 } = require("uuid");
const { getId } = require("../../services/authService");
const {
  validationColumns,
  validationTitle,
} = require("../../services/validations/createBoard.validation");

const prisma = new PrismaClient();

async function createBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = v4();
    const columns = [];
    const createBoard = prisma.board.create({
      data: { id: boardId, title: req.body.title, userId },
    });
    const createColumns = prisma.column.createMany({ data: columns });

    validationTitle(req.body.title, res);
    validationColumns(req.body.columns, columns, boardId);

    await prisma
      .$transaction([createBoard, createColumns])
      .then((board) => {
        return res.status(201).json({ id: board[0].id, title: board[0].title });
      })
      .catch((err) => {
        return res.status(500).json(`${err}`);
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function getBoards(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    await prisma.board
      .findMany({ where: { userId } })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(400).json({ status: 400, err });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "We can't reach this route, try again later",
    });
  }
}

async function getBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.params.id || req.body.boardId;

    await prisma.board
      .findUnique({
        where: { id: boardId },
        include: {
          columns: {
            select: { id: true, column: true },
          },
          tasks: {
            include: {
              subtasks: {
                select: { id: true, title: true, isCompleted: true },
              },
            },
          },
        },
      })
      .then((response) => {
        if (userId !== response.userId) {
          return res
            .status(403)
            .json({ status: 403, message: "Forbidden access" });
        }
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(500).json({ status: 500, err });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteBoard(req, res) {
  try {
    const boardId = req.params.id;
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    await prisma.board
      .delete({ where: { id: boardId } })
      .then(() => {
        return res
          .status(200)
          .json({ status: 200, message: "Board successfully deleted" });
      })
      .catch((err) => {
        return res.status(400).json({
          err,
          status: 400,
          message: "We couldn't delete this board, try again later",
        });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
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
  createBoard,
  getBoards,
  getBoard,
  deleteBoard,
  updateBoard,
};
