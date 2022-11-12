const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./routes/users/users.router");
const boardsRouter = require("./routes/boards/boards.router");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/user", usersRouter);
app.use("/board", boardsRouter);

module.exports = app;
