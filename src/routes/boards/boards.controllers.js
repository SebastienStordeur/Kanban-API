const { PrismaClient } = require("@prisma/client");

async function createBoard(req, res) {
  const prisma = new PrismaClient();

  await prisma.boards.create({
    data: {},
  });
}

module.exports = { createBoard };
