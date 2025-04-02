const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task-btn");
const themeBtn = document.getElementById("theme-toggle");
const tasksList = document.getElementById("tasks-list");
const taskCount = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filters button");

let tasks = [];
let currentFilter = "all";

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
  renderTask(tasks);
});

// LocalStorage Functions
function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("todo-tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    applyFilter();
  }
}

function saveTheme() {
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("todo-theme", isLight ? "light" : "dark");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("todo-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    toggleThemeElements(true);
    themeBtn.textContent = "🌙";
  }
}

// Task Functions
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({
      id: Date.now(),
      completed: false,
      text: taskText,
    });
    taskInput.value = "";
    saveTasks();
    applyFilter();
  }
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    applyFilter();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  applyFilter();
}

function clearTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  applyFilter();
}

function applyFilter() {
  let filteredTasks;
  switch (currentFilter) {
    case "completed":
      filteredTasks = tasks.filter((task) => task.completed);
      break;
    case "active":
      filteredTasks = tasks.filter((task) => !task.completed);
      break;
    default:
      filteredTasks = [...tasks];
  }
  renderTask(filteredTasks);
}

function renderTask(taskList) {
  tasksList.innerHTML =
    taskList.length === 0
      ? '<p class="no-tasks">No Tasks...</p>'
      : taskList
          .map(
            (task) => `
            <li class="task-item ${task.completed ? "completed" : ""}">
              <input type="checkbox" id="${task.id}" ${
              task.completed ? "checked" : ""
            }>
              <label for="${task.id}">${task.text}</label>
              <button class="delete-btn">✕</button>
            </li>
          `
          )
          .join("");

  taskCount.textContent = `${taskList.length} items left`;

  // Add event listeners to new elements
  document
    .querySelectorAll('.task-item input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () =>
        toggleTaskCompletion(Number(checkbox.id))
      );
    });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      deleteTask(Number(btn.parentElement.querySelector("input").id))
    );
  });
}

// Theme Functions
function toggleThemeElements(forceLight = false) {
  const elements = document.querySelectorAll(`
        .image-section,
        .task-input input,
        .task-input button,
        .task-list,
        .task-item,
        .task-actions,
        #task-count,
        .filters button,
        .clear-completed
      `);

  elements.forEach((el) => {
    if (forceLight) {
      el.classList.add("light");
    } else {
      el.classList.toggle("light");
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle("light");
  toggleThemeElements();
  themeBtn.textContent = document.body.classList.contains("light")
    ? "🌙"
    : "🌞";
  saveTheme();
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());
clearBtn.addEventListener("click", clearTasks);
themeBtn.addEventListener("click", toggleTheme);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  });
});
