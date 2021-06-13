const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const { promisify } = require("util");
const cors = require("cors");
const knex = require('knex');

const app = express();

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);


const PORT = process.env.PORT || 3000;

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ramchaik',
    password : '',
    database : 'smart-brain'
  }
});

const database = {
  users: [
    {
      id: "1",
      name: "John",
      email: "john@example.com",
      password: "$2a$10$TAASlPnjTPNMLVXc2DqD5u3W8jEwpBIpNbeX/LkgcKv2UVk.lr2jO",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sally",
      email: "sally@example.com",
      password: "$2a$10$xF8/uOijEcoBwhfjNjTKyOiMVQPa5z/QHNza6t74ZJnIGB0dVkcXW",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", async (req, res) => {
  const user = database.users.find((u) => u.email === req.body.email);

  if (!user) return res.status(404).json("NOT FOUND");
  try {
    if (await compare(req.body.password, user.password)) {
      return res.json(user);
    }
  } catch (error) {
    console.log(error);
  }

  res.status(400).json("error logging in");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      name,
      email,
      joined: new Date(),
    })
    .then((usr) => res.json(usr[0]))
    .catch(
      (err) => console.log(err) && res.status(400).json("unable to register")
    );
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (!user.length) return res.status(404).json("NOT FOUND");

      return res.json(user[0]);
    })
    .catch(
      (err) => console.log(err) && res.status(400).json("Something went wrong!")
    );
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch(
      (err) => console.log(err) && res.status(400).json("Something went wrong!")
    );
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
