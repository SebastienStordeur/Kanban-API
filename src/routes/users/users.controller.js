const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/users/users.mongo");

require("dotenv").config();

async function httpSignup(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //check if email && password are not empty

  if (password.length < 8) {
    return res
      .status(400)
      .json({ status: 400, error: "Password is too short" });
  }

  const user = new User({ email, password: hashedPassword });

  await user
    .save()
    .then(() => {
      return res
        .status(200)
        .json({ status: 200, success: "Your account has been created" });
    })
    .catch(() => {
      return res.status(400).json({
        status: 400,
        error: "Email already used",
      });
    });
}

async function httpLogin(req, res) {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (user) {
    const matchedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!matchedPassword) {
      return res.status(400).json({
        status: 400,
        error: true,
        message: "Wrong email/password combination",
      });
    } else {
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "30d",
      });
      return res.status(200).json({
        id: user._id,
        token,
        status: 200,
      });
    }
  } else {
    return res.status(400).json({
      status: 400,
      error: "User doesn't exist",
    });
  }
}

module.exports = {
  httpSignup,
  httpLogin,
};
