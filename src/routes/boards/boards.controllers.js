const { PrismaClient } = require("@prisma/client");

async function createBoard(req, res) {
  //need to manage the case where colums are included in the request
  const prisma = new PrismaClient();
  console.log(req.body);
  await prisma.board
    .create({
      data: {
        title: req.body.title,
        userId: 11,
      },
    })
    .then(() => {
      return res.status(201).json({ message: "Board created" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Board cant be created" + err });
    });
}

module.exports = { createBoard };
