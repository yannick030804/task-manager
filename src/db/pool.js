const { Pool } = require("pg");

const pool = new Pool({
  user: "yannicksuchy",
  host: "localhost",
  database: "task_manager",
  password: "",
  port: 5432,
});
