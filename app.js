const express = require("express");
const session = require("express-session");

const app = express();

const pool = require("./src/db/pool");
const tasksRoutes = require("./src/routes/tasksRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(express.json());

app.use(
  session({
    secret: "task-manager-secret-2026",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.static("public"));

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
