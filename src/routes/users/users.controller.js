const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function httpSignup(req, res) {
  const prisma = new PrismaClient();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //check if email && password are not empty

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

module.exports = {
  httpSignup,
};
