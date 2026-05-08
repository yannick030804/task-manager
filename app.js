if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const pool = require("./src/db/pool");
const tasksRoutes = require("./src/routes/tasksRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(express.json());

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login.html");
  }

  next();
};

app.use("/styles", express.static("public/styles"));
app.use("/auth", express.static("public/auth"));
app.use("/app", requireAuth, express.static("public/app"));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server working on port ${PORT}`);
});
