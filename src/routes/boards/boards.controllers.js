const { PrismaClient } = require("@prisma/client");
const { getId } = require("../../services/authService");

async function createBoard(req, res) {
  const prisma = new PrismaClient();

  //need to  manage the case where colums are included in the request
  await prisma.board
    .create({
      data: {
        title: req.body.title,
        userId: 13,
      },
    })
    .then(() => {
      return res.status(201).json({ message: "Board created" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Board cant be created" + err });
    });
}

async function getBoards(req, res) {
  const prisma = new PrismaClient();

  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    await prisma.board
      .findMany({
        where: { userId: userId },
      })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } catch (err) {
    return res.status(500).json({ message: "We can't reach this route, try again later" });
  }
}

async function getBoard(req, res) {
  const prisma = new PrismaClient();
  const boardId = JSON.parse(req.params.id);

  await prisma.board
    .findUnique({
      where: {
        id: boardId,
      },
    })
    .then(async (response) => {
      await prisma.task
        .findMany({
          where: {
            boardId,
          },
        })
        .then(async (tasks) => {
          await prisma.column
            .findMany({
              where: {
                boardId,
              },
            })
            .then((columns) => {
              console.log(columns);
              return res.status(200).json({
                id: response.id,
                title: response.title,
                columns,
                tasks,
              });
            });
        });
    })
    .catch((err) => console.log(err));
}

async function deleteBoard(req, res) {
  const prisma = new PrismaClient();
  const boardId = JSON.parse(req.params.id);

  await prisma.board
    .delete({
      where: { id: boardId },
    })
    .then(() => {
      res.status(200).json({ message: "Board successfully deleted" });
    })
    .catch((err) => {
      res.status(400).json({ err, message: "We couldn't delete this board, try again later" });
    });
}

module.exports = { createBoard, getBoards, getBoard, deleteBoard };
