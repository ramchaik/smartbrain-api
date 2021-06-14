const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(([userLogin]) => {
      if (!userLogin) return res.status(404).json("NOT FOUND");

      const isValid = bcrypt.compareSync(password, userLogin.hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({ email: userLogin.email })
          .then(([user]) => res.json(user))
          .catch((err) => res.status(400).json("error getting user"));
      }

      res.status(400).json("incorrect details");
    })
    .catch((err) => res.status(400).json("incorrect details"));
}

module.exports = {
	handleSignIn
}