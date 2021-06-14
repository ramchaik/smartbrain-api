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

app.get("/", user.handleUsersGet(db));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImage(db));

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
