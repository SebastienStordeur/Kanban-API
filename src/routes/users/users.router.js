const express = require("express");
const { httpSignup } = require("./users.controller");

const usersRouter = express.Router();

usersRouter.post("/signup", httpSignup);

module.exports = usersRouter;
