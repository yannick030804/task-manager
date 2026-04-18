const express = require("express");
const app = express();

const pool = require("./src/db/pool");
const tasksRoutes = require("./src/routes/tasksRoutes");

app.use(express.json());

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to DB", err);
  } else {
    console.log("DB connected:", res.rows);
  }
});

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.use("/tasks", tasksRoutes);

app.listen(3000, () => {
  console.log("Server working on port 3000");
});
