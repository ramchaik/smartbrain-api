const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const { promisify } = require("util");

const app = express();

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const PORT = process.env.PORT || 3000;

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
      return res.json("success");
    }
  } catch (error) {
    console.log(error);
  }

  res.status(400).json("error logging in");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await hash(password, null, null);

    database.users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      entries: 0,
      joined: new Date(),
    });
  } catch (error) {
    console.log(error);
  }

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.find((u) => u.id === id);

  if (!user) return res.status(404).json("NOT FOUND");
  res.json(user);
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = database.users.find((u) => u.id === id);

  if (!user) return res.status(404).json("NOT FOUND");

  ++user.entries;

  res.json(user);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
