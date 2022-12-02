const { getId } = require("../../services/authService");
const {
  validationColumns,
  validationTitle,
} = require("../../services/validations/createBoard.validation");

const Board = require("../../models/boards/boards.mongo");
const { default: mongoose } = require("mongoose");

async function httpCreateBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const columns = [];

    validationTitle(req.body.title, res);
    validationColumns(req.body.columns, columns);

    const board = new Board({
      title: req.body.title,
      userId,
      columns,
    });

    await board
      .save()
      .then((board) => {
        return res.status(201).json({ _id: board._id, title: board.title });
      })
      .catch((err) => {
        return res.status(500).json(`${err}`);
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function httpGetBoards(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boards = await Board.find({ userId });
    return res.status(200).json(boards);
  } catch (error) {
    throw new Error(error);
  }
}

async function httpGetBoard(req, res) {
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

async function httpDeleteBoard(req, res) {
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

async function httpUpdateBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.body.id;
    const columns = req.body.columns;
    console.log(columns[0].id);

    const board = await Board.findOne({ _id: boardId });

    if (board.userId !== userId) {
      return res.status(403).json({ status: 403, error: "Forbidden access" });
    }
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Board.updateOne({ _id: boardId }, { title: req.body.title });

      for (let column of columns) {
        await Board.findOneAndUpdate(
          {
            "columns._id": column.id,
          },
          {
            $set: {
              "columns.$.title": column.title,
            },
          },
          { new: true, upsert: true }
        );
      }

      return res.status(200).json({ msg: "OK" });
    });
    session.endSession();
  } catch (err) {
    console.error("ERROR", err);
  }
}

module.exports = {
  httpCreateBoard,
  httpGetBoards,
  httpGetBoard,
  httpDeleteBoard,
  httpUpdateBoard,
};
