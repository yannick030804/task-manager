require("dotenv").config();

const express = require("express");
const session = require("express-session");

const app = express();

const pool = require("./src/db/pool");
const tasksRoutes = require("./src/routes/tasksRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/app/index.html");
  } else {
    res.redirect("/auth/login.html");
  }
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to DB", err);
  } else {
    console.log("DB connected:", res.rows);
  }
});

app.use("/tasks", tasksRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server working on port 3000");
});
