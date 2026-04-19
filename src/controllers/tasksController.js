const pool = require("../db/pool");

/* ----------- CRUD Operations for Tasks ----------- */

// GET /tasks
const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY due_date IS NULL, due_date ASC;",
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};

// POST /tasks
const createTask = async (req, res) => {
  let { title, description = "", completed = false, dueDate = null } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "Title is required and must be a non-empty string." });
  }

  if (typeof description !== "string") {
    return res.status(400).json({ error: "Description must be a string." });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean." });
  }

  if (dueDate === "") {
    dueDate = null;
  }

  if (dueDate !== null) {
    const parsedDate = Date.parse(dueDate);

    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Due date must be a valid date." });
    }

    dueDate = new Date(parsedDate).toISOString();
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, completed, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description.trim(), completed, dueDate],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Database error." });
  }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
  const id = parseInt(req.params.id);

  let { title, description, completed, dueDate } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task id." });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "Title must be a non-empty string." });
    }
    title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({ error: "Description must be a string." });
    }
    description = description.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean." });
    }
  }

  if (dueDate !== undefined) {
    if (dueDate === "" || dueDate === null) {
      dueDate = null;
    } else {
      const parsedDate = Date.parse(dueDate);

      if (isNaN(parsedDate)) {
        return res
          .status(400)
          .json({ error: "Due date must be a valid date." });
      }

      dueDate = new Date(parsedDate).toISOString();
    }
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
      return res.status(404).json({ error: "Task not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error." });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task id." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.status(200).json({
      message: "Task deleted successfully.",
      task: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error." });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
