const { PrismaClient } = require("@prisma/client");
const { v4 } = require("uuid");
const { getId } = require("../../services/authService");
const { validationColumns, validationTitle } = require("../../services/validations/createBoard.validation");
const { validateSubtasks } = require("../../services/validations/createSubtask.validation");
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
    return res.status(500).json({ status: 500, message: "We can't reach this route, try again later" });
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
          return res.status(403).json({ status: 403, message: "Forbidden access" });
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
        return res.status(200).json({ status: 200, message: "Board successfully deleted" });
      })
      .catch((err) => {
        return res.status(400).json({ err, status: 400, message: "We couldn't delete this board, try again later" });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function createTask(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const taskId = v4();
    const subtasks = [];

    const createTask = prisma.task.create({
      data: {
        id: taskId,
        title: req.body.title,
        description: req.body.description,
        columnId: JSON.parse(req.body.columnId),
        boardId: req.body.boardId,
      },
    });
    const createSubtasks = prisma.subTask.createMany({ data: subtasks });

    validateSubtasks(req.body.subtasks, subtasks, taskId);

    await prisma
      .$transaction([createTask, createSubtasks])
      .then((task) => {
        return res.status(201).json(task);
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

async function deleteTask(req, res) {
  try {
    const boardId = req.params.id;
    await prisma.task
      .delete({ where: { id: boardId } })
      .then((response) => {
        res.status(200).json({ message: "Task deleted", response });
      })
      .catch((err) => {
        res.status(500).json({ message: "Can't delete this task ", err });
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function updateBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    const boardId = req.body.id;
    const columns = req.body.columns;

    const updateBoardData = prisma.board.update({
      where: { id: req.body.id },
      data: { title: req.body.title },
    });

    const upsertColumns = prisma.column.upsert({
      where: { id: 85 },
      update: columns[0],
      create: columns[0],
    });

    await prisma
      .$transaction([updateBoardData, upsertColumns])
      .then((board) => {
        return res.status(201).json({ board });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(`${err}`);
      })
      .finally(() => {
        return prisma.$disconnect();
      });
    /* await prisma
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
      }); */
  } catch (err) {
    console.error("ERROR", err);
  }
}

async function updateSubtask(req, res) {
  try {
    await prisma.subTask
      .update({
        where: { id: req.body.id },
        data: { isCompleted: req.body.isCompleted },
      })
      .then(() => {
        return res.status(200).json({ message: "Subtask updated" });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Impossible to update this subtask for now. Try again later" + err });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { createBoard, getBoards, getBoard, deleteBoard, createTask, deleteTask, updateBoard, updateSubtask };
