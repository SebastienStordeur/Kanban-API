function isPasswordLongEnough(password, res) {
  if (password.length < 8) {
    return res.status(400).json({ error: "Password is too short" });
  }
}

module.exports = {
  isPasswordLongEnough,
};
