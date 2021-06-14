const handleUsersGet = (db) => (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Something went wrong!"));
};

module.exports = {
  handleUsersGet,
};
