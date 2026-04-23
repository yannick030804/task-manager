# Task Manager Web Application

Full-stack task management web application with user authentication and user-specific data handling.
This project allows users to register, log in, and manage their own tasks with filtering, validation, and a clean UI.

---

## Live Demo

[Live Demo](https://task-manager-backend-aai6.onrender.com/auth/login.html)

---

## Features

- User registration and login (session-based authentication)
- Secure password hashing using bcrypt
- Create, update, and delete tasks (CRUD)
- Tasks linked to individual users
- Filtering tasks:
  - All
  - Pending
  - Completed
  - Overdue
- Validation on both frontend and backend
- Responsive and clean UI
- Modal-based task editing
- Protected routes (only authenticated users can access tasks)

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- express-session
- bcrypt

### Frontend
- HTML
- CSS
- Vanilla JavaScript (no frameworks)

---

## Project Structure

```bash
task-manager/
│
├── public/
│   ├── app/
│   │   ├── index.html
│   │   └── script.js
│   │
│   ├── auth/
│   │   ├── login.html
│   │   ├── register.html
│   │   └── auth.js
│   │
│   └── styles/
│       ├── styleIndex.css
│       ├── styleLogin.css
│       └── styleRegister.css
│
├── src/
│   ├── controllers/
│   │   ├── tasksController.js
│   │   └── authController.js
│   │
│   ├── routes/
│   │   ├── tasksRoutes.js
│   │   └── authRoutes.js
│   │
│   └── db/
│       └── pool.js
│
├── schema.sql
├── app.js
└── package.json
```

---

## Database Schema

The database is defined in `schema.sql`.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yannick030804/task-manager.git
cd task-manager
```

Install dependencies:

```bash
npm install
```

---

## Dependencies

Main packages used:

```bash
npm install express pg bcrypt express-session
```

---

## Database Setup

1. Create a PostgreSQL database  

2. Run the schema locally:

```bash
psql -U your_user -d your_database -f schema.sql
```

### Using a remote database (e.g. Render)

If you are using a hosted PostgreSQL database, you can initialize it using:

```bash
psql "YOUR_DATABASE_URL" -f schema.sql
```

> Note: Free-tier databases (like Render) may expire. In that case, create a new database, update the `DATABASE_URL`, and run this command again.

---

## Run the Application

```bash
node app.js
```

Open in browser:

```
http://localhost:3000/auth/login.html
```

---

## Usage

1. Register a new user  
2. Log in  
3. Create tasks  
4. Edit or delete tasks  
5. Use filters  

---

## API Endpoints

### Auth

- POST /auth/register  
- POST /auth/login  
- POST /auth/logout  
- GET /auth/me  

### Tasks

- GET /tasks  
- POST /tasks  
- PUT /tasks/:id  
- DELETE /tasks/:id  

Filtering:

```
/tasks?filter=completed
/tasks?filter=pending
/tasks?filter=overdue
```

---

## Authentication

- Session-based authentication using express-session  
- Passwords hashed using bcrypt  
- Users can only access their own tasks  

---

## What I Learned

- Designing REST APIs  
- Implementing authentication  
- Working with PostgreSQL  
- Structuring backend projects  
- Connecting frontend and backend   

---

## Author

Yannick Suchy Viñolo  
- GitHub: https://github.com/yannick030804  
- LinkedIn: https://www.linkedin.com/in/yannick-suchy-vi%C3%B1olo-2b8624309/
