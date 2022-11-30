const jwt = require("jsonwebtoken");
const User = require("../models/users/users.mongo");

async function getId(data) {
  try {
    const jwtToken = data.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtToken);

    const user = await User.findOne({ _id: decodedToken.id });
    /*     await prisma.user.findUnique({
      where: { id: decodedToken.id },
    }); */

    if (!user) {
      throw new Error("This user can't be reached");
    }

    return user;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { getId };
