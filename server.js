const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const user = require("./controllers/user");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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

app.get("/", (req, res) => user.handleUsersGet(req, res, db));
app.post("/signin", (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post("/register", (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));
app.put("/image", (req, res) => image.handleImage(req, res, db));

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
