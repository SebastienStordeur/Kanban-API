function validationTitle(title, error) {
  title.trim() === "" ? (error = true) : (error = false);
  return error;
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
