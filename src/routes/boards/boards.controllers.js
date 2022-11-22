const { PrismaClient } = require("@prisma/client");
const { v4 } = require("uuid");
const { getId } = require("../../services/authService");
const { validationColumns, validationTitle } = require("../../services/validations/createBoard.validation");
const prisma = new PrismaClient();

async function createBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = v4();
    const columns = [];
    const createBoard = prisma.board.create({ data: { id: boardId, title: req.body.title, userId } });
    const createColumns = prisma.column.createMany({ data: columns });

    validationTitle(req.body.title, res);
    validationColumns(req.body.columns, columns, boardId);

    await prisma
      .$transaction([createBoard, createColumns])
      .then((board) => {
        return res.status(201).json(board[0]);
      })
      .catch((err) => {
        return res.status(500).json(`${err}`);
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
    const boardId = req.params.id || req.body.boardId;

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
  const boardId = req.params.id;
  const authServiceResponse = await getId(req);
  const userId = authServiceResponse.id;

  //need to check if the board is owned by the user
  try {
    await prisma.board
      .delete({ where: { id: boardId } })
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

async function createTask(req, res) {
  const authServiceResponse = await getId(req);
  console.log(req.body);

  try {
    await prisma.task
      .create({
        data: {
          title: req.body.title,
          description: req.body.description,
          boardId: req.body.boardId,
          columnId: JSON.parse(req.body.columnId),
        },
      })
      .then(async (response) => {
        console.log("response:", response);
        if (req.body.subtasks) {
          for (let subtask of req.body.subtasks) {
            console.log(subtask.subtask);
          }
          for (let subtask of req.body.subtasks) {
            console.log(subtask);
            await prisma.subTask.create({
              data: {
                title: subtask.title,
                taskId: JSON.parse(response.id),
                isCompleted: false,
              },
            });
          }
        }
        res.status(201).json(response);
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function updateBoard(req, res) {
  const columns = req.body.columns;
  try {
    await prisma
      .$transaction([
        prisma.board
          .update({
            where: { id: req.body.id },
            data: { title: req.body.title },
          })
          .then((response) => console.log("response", response))
          .catch((err) => console.log(err)),
        columns.map((column) => {
          prisma.column
            .upsert({
              where: { id: column.id },
              update: { column: column.column },
              create: {
                column: column.column,
                boardId: req.body.id,
              },
            })
            .then((response) => console.log("map response", response))
            .catch((err) => console.log(err));
        }),
      ])
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(400).json({ message: `Error while handling the request + ${err}` });
      });
  } catch (err) {
    console.error("ERROR", err);
  }
}

async function updateSubtask(req, res) {
  console.log(req.params);
  try {
    await prisma.subTask
      .update({
        where: { id: req.body.id },
        data: {
          isCompleted: req.body.isCompleted,
        },
      })
      .then((response) => {
        return res.status(200).json({ message: "Subtask updated" });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Impossible to update this subtask for now. Try again later" + err });
      });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { createBoard, getBoards, getBoard, deleteBoard, createTask, updateBoard, updateSubtask };
