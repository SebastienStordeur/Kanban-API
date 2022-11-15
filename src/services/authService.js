const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

async function getId(data) {
  try {
    const prisma = new PrismaClient();
    const jwtToken = data.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtToken);

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new Error("This user can't be reached");
    }

    return user;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { getId };
