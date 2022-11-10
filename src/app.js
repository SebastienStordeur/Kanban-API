const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users/users.router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", usersRouter);

module.exports = app;
