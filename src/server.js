const http = require("http");
const mongoose = require("mongoose");

const PORT = 8000;

const app = require("./app");

const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app);

mongoose.connection.on("open", (err) => {
  console.log("Connection to Mongo DB OK");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
