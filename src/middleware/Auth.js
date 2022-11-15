const jwt = require("jsonwebtoken");

require("dotenv").config();

function checkAuthentification(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;

    //Todo, make the middleware handling cases where the loaded board isn't own by this user

    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("You are not allowed to access this content");
    } else next();
  } catch (err) {
    res.status(401).json({ message: "Unauthenticated request", status: 401, err });
  }
}

module.exports = checkAuthentification;
