const mongoose = require("mongoose");

const boardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  columns: {
    type: [
      {
        title: String,
        tasks: {
          type: [
            {
              title: String,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Board", boardsSchema);
