const tasksContainer = document.getElementById("tasks-container");
const newTask = document.getElementById("task-form");
const taskTitle = document.getElementById("title");
const taskDescription = document.getElementById("description");
const taskDueDate = document.getElementById("dueDate");

const error = document.getElementById("error-text");

const loadTasks = async () => {
  const response = await fetch("/tasks");
  const tasks = await response.json();

  console.log(tasks);

  renderTasks(tasks);
};

function renderTasks(tasks) {
  tasksContainer.innerHTML = "";

  if (tasks.length === 0) {
    const text = document.createElement("h3");
    text.id = "error-text";
    text.textContent = "There are no tasks";
    tasksContainer.appendChild(text);
    return;
  }

  for (let i = 0; i < tasks.length; i++) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = tasks[i].id;

    const date = tasks[i].due_date
      ? new Date(tasks[i].due_date).toLocaleDateString()
      : "-";

    card.innerHTML = `
      <div class="task-row">
        <div class="task-text">
          <h3 class="title">${tasks[i].title}</h3>
          <p class="description">${tasks[i].description || "No description"}</p>
        </div>
        <div class="task-date">
          ${date}
        </div>
      </div>
    `;

    tasksContainer.appendChild(card);
  }
}

loadTasks();

document.addEventListener("click", (e) => {
  const card = e.target.closest(".task-card");
  if (!card) return;
  const taskId = card.dataset.id;
  console.log("Task clicked:", taskId);
});

newTask.addEventListener("submit", function (e) {
  e.preventDefault();
  error.textContent = "";
  error.style.color = "black";

  if (
    taskDueDate.value &&
    taskDueDate.value < new Date().toISOString().split("T")[0]
  ) {
    error.style.color = "red";
    error.textContent = "Due date cannot be in the past.";
    return;
  }

  if (!taskTitle.value) {
    error.style.color = "red";
    error.textContent = "Title cannot be empty.";
    return;
  }

  const task = {
    title: taskTitle.value,
    description: taskDescription.value,
    dueDate: taskDueDate.value,
  };

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => response.json())
    .then((data) => {
      newTask.reset();
      loadTasks();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
