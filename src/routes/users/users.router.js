const express = require("express");
const { httpSignup, httpLogin, httpGetProfile } = require("./users.controller");
const auth = require("../../middleware/Auth");

const usersRouter = express.Router();

usersRouter.post("/signup", httpSignup);
usersRouter.post("/login", httpLogin);
/* usersRouter.get("/", auth, httpGetProfile); //???*/

module.exports = usersRouter;
