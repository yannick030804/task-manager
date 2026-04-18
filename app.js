const express = require("express");
const app = express();

const { Pool } = require("pg");

const pool = new Pool({
  user: "yannicksuchy",
  host: "localhost",
  database: "task_manager",
  password: "",
  port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to DB", err);
  } else {
    console.log("DB connected:", res.rows);
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

/* --------- CRUD Operations --------- */

// GET /tasks - Obtener todas las tareas
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /tasks - Crear una nueva tarea
app.post("/tasks", async (req, res) => {
  const { title, description, completed, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, completed, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description ?? "", completed ?? false, dueDate ?? null],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /tasks/:id - Actualizar una tarea existente
app.put("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed, dueDate } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           due_date = COALESCE($4, due_date)
       WHERE id = $5
       RETURNING *`,
      [title, description, completed, dueDate, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /tasks/:id - Eliminar una tarea existente
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, () => {
  console.log("Server working on port 3000");
});
