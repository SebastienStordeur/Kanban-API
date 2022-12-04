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
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.body.id;
    const board = await Board.findOne({ _id: boardId });
    const subtasks = req.body.subtasks;

    if (board.userId !== userId) {
      return res.status(403).json({ status: 403, error: "Forbidden access" });
    }

    /* 
      TODO : Handle and delete empty subtasks before updating
    */

    await Board.updateOne(
      { "tasks._id": req.body.id },
      { $set: { "tasks.$[].subtasks": subtasks } }
    )
      .then(() => {
        return res
          .status(200)
          .json({ status: 200, message: "Subtask updated" });
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Impossible to update this subtask for now. Try again later " + err,
        });
      });
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
