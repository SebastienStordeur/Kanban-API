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
      },
    ],
    default: [],
  },
  tasks: {
    type: [
      {
        title: String,
        description: String,
        columnId: String,
        subtasks: {
          type: [
            {
              title: String,
              isCompleted: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      },
    ],
  },
});

module.exports = mongoose.model("Board", boardsSchema);
