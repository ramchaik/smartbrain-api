const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const app = express();

const PORT = process.env.PORT || 3000;

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "ramchaik",
    password: "",
    database: "smart-brain",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Something went wrong!"));
});

app.post("/signin", (req, res) => {
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
});

app.post("/register", (req, res) => {
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
});

app.get("/profile/:id", (req, res) => {
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
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(([entries]) => res.json(entries))
    .catch((err) => res.status(400).json("Something went wrong!"));
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
