const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello world!</h1>");
});

app.post("/signin", (req, res) => {
  res.send("signin");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
