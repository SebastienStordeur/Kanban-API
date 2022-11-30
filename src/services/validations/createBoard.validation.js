function validationTitle(title, res) {
  if (title.trim() === "") {
    return res.status(500).json({ message: "Title can't be empty" });
  }
}

function validationColumns(columns, array) {
  for (const column of columns) {
    if (column.title.trim() === "") {
      console.log(column);
    } else {
      array.push(column);
    }
  }
  return array;
}

module.exports = { validationTitle, validationColumns };
