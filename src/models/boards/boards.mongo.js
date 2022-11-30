const mongoose = require("mongoose");

const boardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  /*   columns: {

  } */
});

module.exports = mongoose.model("Board", boardsSchema);
