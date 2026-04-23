let tasksData = [];
const tasksContainer = document.getElementById("tasks-container");

// New task form
const newTask = document.getElementById("task-form");
const taskTitle = document.getElementById("title");
const taskDescription = document.getElementById("description");
const taskDueDate = document.getElementById("dueDate");

// Modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalDueDate = document.getElementById("modal-dueDate");
const modalCompleted = document.getElementById("modal-completed");
const closeBtn = document.getElementById("close-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");

let currentTaskId = null;

// Error text
const error = document.getElementById("error-text");
const modalError = document.getElementById("modal-error-text");

const loadTasks = async () => {
  const response = await fetch("/tasks");
  const tasks = await response.json();

  console.log(tasks);

  tasksData = tasks;
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(tasks[i].due_date);
    const isOverdue =
      tasks[i].due_date && taskDate < today && !tasks[i].completed;

    card.innerHTML = `
      <div class="task-row">
        <div class="task-text">
          <h3 class="title">${tasks[i].title}</h3>
        </div>
        <div class="task-date">
          ${date}
        </div>
      </div>
    `;

    if (tasks[i].completed) {
      card.classList.add("completed");
    } else if (isOverdue) {
      card.classList.add("overdue");
    }

    tasksContainer.appendChild(card);
  }
}

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

loadTasks();

document.addEventListener("click", async (e) => {
  const card = e.target.closest(".task-card");

  if (!card) {
    return;
  }

  const taskId = card.dataset.id;
  currentTaskId = taskId;
  const task = tasksData.find((t) => t.id == taskId);

  modalError.textContent = "";
  modalTitle.value = task.title;
  modalDescription.value = task.description || "";
  modalDueDate.value = task.due_date ? task.due_date.split("T")[0] : "";
  modalCompleted.checked = task.completed;
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

saveBtn.addEventListener("click", async () => {
  modalError.textContent = "";
  modalError.style.color = "red";

  if (!modalTitle.value.trim()) {
    modalError.textContent = "Title cannot be empty.";
    return;
  }

  if (
    modalDueDate.value &&
    modalDueDate.value < new Date().toISOString().split("T")[0]
  ) {
    modalError.textContent = "Due date cannot be in the past.";
    return;
  }

  const updatedTask = {
    title: modalTitle.value,
    description: modalDescription.value,
    dueDate: modalDueDate.value || null,
    completed: modalCompleted.checked,
  };

  await fetch(`/tasks/${currentTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  modal.classList.add("hidden");
  loadTasks();
});

deleteBtn.addEventListener("click", async () => {
  const confirmed = confirm("Are you sure you want to delete this task?");

  if (!confirmed) return;

  await fetch(`/tasks/${currentTaskId}`, {
    method: "DELETE",
  });

  modal.classList.add("hidden");
  loadTasks();
});

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  await fetch("/auth/logout", { method: "POST" });

  window.location.href = "/auth/login.html";
});
