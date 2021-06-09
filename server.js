const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

const database = {
  users: [
    {
      id: "1",
      name: "John",
      email: "john@example.com",
      password: "john",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sally",
      email: "sally@example.com",
      password: "sally",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    return res.json("success");
  }
  res.status(400).json("error logging in");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  database.users.push({
    id: Date.now(),
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
