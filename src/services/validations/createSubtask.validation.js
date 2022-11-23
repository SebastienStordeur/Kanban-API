function validateSubtasks(subtasks, array, id) {
  for (const subtask of subtasks) {
    if (subtask.title.trim() === "") {
      console.log(subtask);
    } else {
      subtask.taskId = id;
      array.push(subtask);
    }
  }
  return array;
}

module.exports = { validateSubtasks };
