const express = require("express");
const { httpSignup, httpLogin } = require("./users.controller");

const usersRouter = express.Router();

usersRouter.post("/signup", httpSignup);
usersRouter.post("/login", httpLogin);

module.exports = usersRouter;
