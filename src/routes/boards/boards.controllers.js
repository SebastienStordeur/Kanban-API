const { PrismaClient } = require("@prisma/client");

async function createBoard(req, res) {
  const prisma = new PrismaClient();
  if (req.body.columns !== []) {
    console.log("Colums exists");
    return res.status(201).json({ message: "Colums detected" });
  } else {
    //need to  manage the case where colums are included in the request

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
}

async function getBoards(req, res) {
  const prisma = new PrismaClient();

  //get all board from specific user
  await prisma.board
    .findMany({
      where: {
        userId: 11,
      },
    })
    .then((response) => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch((err) => console.log(err));
}

async function getBoard(req, res) {
  const prisma = new PrismaClient();

  await prisma.board
    .findUnique({
      where: {
        id: 11,
      },
    })
    .then((response) => {
      console.log(response);
      return res.status(200).json(response);
    })
    .catch((err) => console.log(err));
}

module.exports = { createBoard, getBoards, getBoard };
