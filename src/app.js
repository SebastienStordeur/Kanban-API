const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./routes/users/users.router");
const boardsRouter = require("./routes/boards/boards.router");
const tasksRouter = require("./routes/tasks/task.router");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/user", usersRouter);
app.use("/board", boardsRouter);
app.use("/task", tasksRouter);

module.exports = app;
