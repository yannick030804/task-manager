const express = require("express");
const app = express();

app.use(express.json());

const tasks = [];

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// GET /tasks - Obtener todas las tareas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST /tasks - Crear una nueva tarea
app.post("/tasks", (req, res) => {
  const { title, description, completed, dueDate } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description ?? "",
    completed: completed ?? false,
    createdAt: new Date().toISOString(),
    dueDate: dueDate ?? null,
  };

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  tasks.push(newTask);

  res.json(newTask);
});

// PUT /tasks/:id - Actualizar una tarea existente
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed, dueDate } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (title !== undefined) {
    task.title = title;
  }
  if (description !== undefined) {
    task.description = description;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }
  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  res.json(task);
});

// DELETE /tasks/:id - Eliminar una tarea existente
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1);

  res.json(deletedTask[0]);
});

app.listen(3000, () => {
  console.log("Server working on port 3000");
});
