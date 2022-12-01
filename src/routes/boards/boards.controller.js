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

async function getBoards(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boards = await Board.find({ userId });
    return res.status(200).json(boards);
  } catch (error) {
    throw new Error(error);
  }
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
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.body.id;
    const columns = req.body.columns;

    await Board.findOne({ _id: boardId })
      .then(async (board) => {
        if (board.userId === userId) {
          const session = await mongoose.startSession();

          await session.withTransaction(async () => {
            await Board.updateOne({ _id: boardId }, { title: req.body.title });
            await Board.findOneAndUpdate(
              { _id: boardId },
              { columns: [...columns] },
              { new: true, upsert: true }
            );
            return res.status(200).json({ msg: "OK" });
          });
          session.endSession();
        } else {
          return res
            .status(403)
            .json({ status: 403, error: "Forbidden access", err });
        }
      })
      .catch((err) => {
        return res.status(500).json(err);
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
