const { PrismaClient, prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

async function httpSignup(req, res) {
  const prisma = new PrismaClient();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //check if email && password are not empty

  if (password.length < 8) {
    return res.status(400).json({ error: "Password is too short" });
  }

  await prisma.user
    .create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    .then(() => {
      return res.status(200).json({ message: "User created" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Email already used" });
    });
}

async function httpLogin(req, res) {
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    const matchedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!matchedPassword) {
      return res.status(400).json({ error: true, message: "Wrong email/password combination" });
    } else {
      const payload = {
        id: user.id,
        refreshToken: "Un autre token",
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
      return res.status(200).json({ id: user.id, token, refreshToken: "Un autre token" });
    }
  } else {
    return res.status(400).json({ error: "User doesn't exist" });
  }
}

module.exports = {
  httpSignup,
  httpLogin,
};
