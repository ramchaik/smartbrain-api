const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        email,
        hash: hashedPassword,
      })
      .into("login")
      .returning("email")
      .then(([loginEmail]) =>
        trx("users")
          .returning("*")
          .insert({
            name,
            email: loginEmail,
            joined: new Date(),
          })
          .then(([user]) => res.json(user))
      )
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

module.exports = {
  handleRegister,
};
