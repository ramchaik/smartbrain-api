const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then(([user]) => {
      if (!user) return res.status(404).json("NOT FOUND");

      return res.json(user);
    })
    .catch((err) => res.status(400).json("Something went wrong!"));
};

module.exports = { handleProfileGet };
