const { getId } = require("../../services/authService");
const {
  validateSubtasks,
} = require("../../services/validations/createSubtask.validation");

const Board = require("../../models/boards/boards.mongo");

async function httpCreateTask(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    const task = req.body.task;
    const subtasks = [];

    await Board.updateOne(
      { _id: req.body.id },
      { $push: { tasks: task } },
      { new: true }
    )
      .then(() => {
        return res.status(200).json({ status: 200, success: true });
      })
      .catch((err) => {
        return res.status(500).json({ status: 500, err });
      });

    /*     const createTask = prisma.task.create({
      data: {
        id: taskId,
        title: req.body.title,
        description: req.body.description,
        columnId: JSON.parse(req.body.columnId),
        boardId: req.body.boardId,
      },
    });
    const createSubtasks = prisma.subTask.createMany({ data: subtasks });

    validateSubtasks(req.body.subtasks, subtasks, taskId); */

    /*   */
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
        return res.status(200).json({ message: "Task deleted", response });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Can't delete this task ", err });
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function updateTask(req, res) {
  try {
    const subtasks = req.body.subtasks;
    await prisma.task
      .update({
        where: { id: req.body.id },
        data: {
          title: req.body.title,
          description: req.body.description,
          columnId: req.body.columnId,
        },
      })
      .then(async () => {
        try {
          for (const subtask of subtasks) {
            if (subtask.id) {
              await prisma.subTask.update({
                where: { id: subtask.id },
                data: {
                  title: subtask.title,
                },
              });
            } else {
              await prisma.subTask.create({
                data: {
                  title: subtask.title,
                  taskId: req.body.id,
                },
              });
            }
          }
          return res
            .status(201)
            .json({ message: "Task successfully update", status: 201 });
        } catch (err) {
          throw new Error(err);
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    throw new Error(err);
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
        return res.status(500).json({
          message:
            "Impossible to update this subtask for now. Try again later " + err,
        });
      })
      .finally(() => {
        return prisma.$disconnect();
      });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  httpCreateTask,
  deleteTask,
  updateTask,
  updateSubtask,
};
