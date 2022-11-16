const { PrismaClient } = require("@prisma/client");
const { getId } = require("../../services/authService");
const prisma = new PrismaClient();

async function createBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    //add request for columns

    await prisma.board
      .create({
        data: {
          title: req.body.title,
          userId: userId,
        },
      })
      .then(() => {
        return res.status(201).json({ message: "Board created" });
      })
      .catch((err) => {
        return res.status(400).json({ message: "Board cant be created" + err });
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
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = JSON.parse(req.params.id);

    await prisma.board
      .findUnique({
        where: { id: boardId },
        include: {
          columns: {
            select: {
              id: true,
              column: true,
            },
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
          return res.status(403).json({ status: 403, message: "Forbidden access" });
        }
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(500).json({ msg: "error", err });
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteBoard(req, res) {
  const boardId = JSON.parse(req.params.id);
  const authServiceResponse = await getId(req);
  const userId = authServiceResponse.id;

  console.log(req.body);

  //need to check if the board is owned by the user
  try {
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
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { createBoard, getBoards, getBoard, deleteBoard };
