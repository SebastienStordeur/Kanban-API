function validationTitle(title, res) {
  if (title.trim() === "") {
    return res.status(500).json({ message: "Title can't be empty" });
  }
}

function validationColumns(columns, array, id) {
  for (const column of columns) {
    if (column.column.trim() === "") {
      console.log(column);
    } else {
      column.boardId = id;
      array.push(column);
    }
  }
  return array;
}

module.exports = { validationTitle, validationColumns };
