const { getId } = require("../../services/authService");
const {
  validationColumns,
  validationTitle,
} = require("../../services/validations/createBoard.validation");

const Board = require("../../models/boards/boards.mongo");

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

    if (board.userId !== userId) {
      return res.status(403).json({ status: 403, error: "Forbidden access" });
    }

    await board
      .deleteOne({ _id: boardId })
      .then(() => {
        return res.status(200).json({ status: 200, success: true });
      })
      .catch(() => {
        return res.status(500).json({
          status: 500,
          error: "We couldn't delete this board. Try again later.",
          success: false,
        });
      });
  } catch (err) {
    throw new Error(err);
  }
}

async function httpUpdateBoard(req, res) {
  try {
    const authServiceResponse = await getId(req);
    const userId = authServiceResponse.id;
    const boardId = req.body.id;
    const title = req.body.title;
    const columns = req.body.columns;
    const board = await Board.findOne({ _id: boardId });

    if (board.userId !== userId) {
      return res.status(403).json({ status: 403, error: "Forbidden access" });
    }

    validationTitle(title, res);
    //operation delete empty title col + tasks
    //add transaction

    await Board.updateOne(
      { _id: boardId },
      { $set: { title, columns } },
      { upsert: true, new: true }
    )
      .then((response) => {
        return res.status(200).json({ status: 200, response });
      })
      .catch((err) => {
        return res.status(500).json({ status: 500, err });
      });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  httpCreateBoard,
  httpGetBoards,
  httpGetBoard,
  httpDeleteBoard,
  httpUpdateBoard,
};
