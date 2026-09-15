/* =========================================================
   Mini-Trello JavaScript
   This file connects the HTML page to Django's API.
   ========================================================= */

const API_URL = "/api/tasks/";

/*
 * The three statuses are kept in the same order as the board.
 * 0 = To Do
 * 1 = In Progress
 * 2 = Done
 */
const STATUS_ORDER = ["todo", "in_progress", "done"];

// Get important HTML elements once.
const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

const modal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");
const messageBox = document.getElementById("messageBox");


/* ---------------- CSRF helper ---------------- */

/*
 * Django protects POST/PATCH/DELETE requests with CSRF.
 * This function reads Django's CSRF cookie.
 */
function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();

        if (trimmedCookie.startsWith(name + "=")) {
            return decodeURIComponent(trimmedCookie.substring(name.length + 1));
        }
    }

    return "";
}


/* ---------------- Messages ---------------- */

function showMessage(text) {
    messageBox.innerHTML = "";

    const message = document.createElement("div");
    message.className = "message";
    message.textContent = text;

    messageBox.appendChild(message);

    // Remove the message after a few seconds.
    setTimeout(() => {
        message.remove();
    }, 3000);
}


/* ---------------- Modal ---------------- */

function openModal() {
    modal.classList.remove("hidden");
    document.getElementById("title").focus();
}

function closeModal() {
    modal.classList.add("hidden");
    taskForm.reset();
}

document.getElementById("openModalButton").addEventListener("click", openModal);
document.getElementById("closeModalButton").addEventListener("click", closeModal);
document.getElementById("cancelButton").addEventListener("click", closeModal);


/* ---------------- Load Tasks ---------------- */

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load tasks.");
        }

        const tasks = await response.json();

        renderTasks(tasks);
    } catch (error) {
        showMessage("Could not connect to the backend.");
        console.error(error);
    }
}


/* ---------------- Render Tasks ---------------- */

function renderTasks(tasks) {
    // Clear old cards before drawing new cards.
    todoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    // Keep track of task counts.
    let todoTotal = 0;
    let progressTotal = 0;
    let doneTotal = 0;

    tasks.forEach((task) => {
        const card = createTaskCard(task);

        if (task.status === "todo") {
            todoTasks.appendChild(card);
            todoTotal++;
        } else if (task.status === "in_progress") {
            progressTasks.appendChild(card);
            progressTotal++;
        } else if (task.status === "done") {
            doneTasks.appendChild(card);
            doneTotal++;
        }
    });

    // Show a helpful message when a column is empty.
    showEmptyMessage(todoTasks);
    showEmptyMessage(progressTasks);
    showEmptyMessage(doneTasks);

    todoCount.textContent = todoTotal;
    progressCount.textContent = progressTotal;
    doneCount.textContent = doneTotal;
}


function showEmptyMessage(container) {
    if (container.children.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-message";
        empty.textContent = "No tasks here yet.";
        container.appendChild(empty);
    }
}


/* ---------------- Task Card ---------------- */

function createTaskCard(task) {
    const card = document.createElement("article");
    card.className = "task-card";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;

    card.appendChild(title);
    card.appendChild(description);

    if (task.assigned_to) {
        const assigned = document.createElement("p");
        assigned.className = "assigned-person";
        assigned.textContent = "Assigned to: " + task.assigned_to;
        card.appendChild(assigned);
    }

    const actions = document.createElement("div");
    actions.className = "card-actions";

    // Previous button.
    if (task.status !== "todo") {
        const previousButton = document.createElement("button");
        previousButton.className = "action-button";
        previousButton.textContent = "← Previous";

        previousButton.addEventListener("click", () => {
            moveTask(task.id, getPreviousStatus(task.status));
        });

        actions.appendChild(previousButton);
    } else {
        // Keep the layout balanced.
        const emptySpace = document.createElement("span");
        actions.appendChild(emptySpace);
    }

    // Delete button.
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id, task.title);
    });

    actions.appendChild(deleteButton);

    // Next button.
    if (task.status !== "done") {
        const nextButton = document.createElement("button");
        nextButton.className = "action-button";
        nextButton.textContent = "Next →";

        nextButton.addEventListener("click", () => {
            moveTask(task.id, getNextStatus(task.status));
        });

        actions.appendChild(nextButton);
    }

    card.appendChild(actions);

    return card;
}


/* ---------------- Status Helpers ---------------- */

function getNextStatus(currentStatus) {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    return STATUS_ORDER[currentIndex + 1];
}

function getPreviousStatus(currentStatus) {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    return STATUS_ORDER[currentIndex - 1];
}


/* ---------------- Create Task ---------------- */

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const assignedTo = document.getElementById("assignedTo").value.trim();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                title: title,
                description: description,
                assigned_to: assignedTo,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not create task.");
        }

        closeModal();
        showMessage("Task created successfully.");
        loadTasks();
    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
});


/* ---------------- Move Task ---------------- */

async function moveTask(taskId, newStatus) {
    try {
        const response = await fetch(`${API_URL}${taskId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not move task.");
        }

        showMessage("Task status updated.");
        loadTasks();
    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}


/* ---------------- Delete Task ---------------- */

async function deleteTask(taskId, taskTitle) {
    const confirmed = confirm(
        `Are you sure you want to delete "${taskTitle}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}${taskId}/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not delete task.");
        }

        showMessage("Task deleted.");
        loadTasks();
    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}


/* ---------------- Start Application ---------------- */

// Load saved tasks as soon as the page opens.
loadTasks();
