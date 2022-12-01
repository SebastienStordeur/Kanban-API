const { getId } = require("../../services/authService");
const {
  validateSubtasks,
} = require("../../services/validations/createSubtask.validation");

const Board = require("../../models/boards/boards.mongo");

const mongoose = require("mongoose");

async function httpCreateTask(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;

    const task = req.body.task;

    await Board.updateOne({ _id: req.body.id }, { $push: { tasks: task } })
      .then(() => {
        return res.status(200).json({ status: 200, success: true });
      })
      .catch((err) => {
        return res.status(500).json({ status: 500, err });
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function httpDeleteTask(req, res) {
  try {
    await Board.updateOne(
      { _id: req.body.id },
      { $pull: { tasks: { _id: req.body.taskId } } }
    )
      .then((response) => {
        return res.status(200).json({ status: 200, response });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function httpUpdateTask(req, res) {
  console.log(req.body);
  try {
    const subtasks = req.body.task.subtasks;
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Board.updateOne(
        { "tasks._id": req.body.task.id },
        {
          $set: {
            "tasks.$.title": req.body.task.title,
            "tasks.$.description": req.body.task.description,
            "tasks.$.columnId": req.body.task.columnId,
          },
        }
      );

      await Board.findOneAndUpdate(
        { "tasks._id": req.body.task.id },
        { "tasks.$.subtasks": [...subtasks] },
        { new: true, upsert: true }
      )
        .then((response) => {
          return res.status(200).json({ status: 200, response });
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });
    session.endSession();
  } catch (err) {
    throw new Error(err);
  }
}

async function httpUpdateSubtask(req, res) {
  try {
    /* await prisma.subTask
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
      }); */
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  httpCreateTask,
  httpDeleteTask,
  httpUpdateTask,
  httpUpdateSubtask,
};
