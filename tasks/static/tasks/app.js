/* =========================================================
   Mini-Trello JavaScript
   ========================================================= */

const API_URL = "/api/tasks/";
const PEOPLE_API_URL = "/api/people/";

const STATUS_ORDER = ["todo", "in_progress", "done"];


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

const modal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");
const messageBox = document.getElementById("messageBox");

const teamButton = document.getElementById("teamButton");
const teamModal = document.getElementById("teamModal");
const closeTeamModal = document.getElementById("closeTeamModal");

const personForm = document.getElementById("personForm");
const peopleList = document.getElementById("peopleList");

const assignedToSelect =
    document.getElementById("assignedTo");


/* =========================================================
   CSRF HELPER
   ========================================================= */

function getCookie(name) {

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {

        const trimmedCookie = cookie.trim();

        if (trimmedCookie.startsWith(name + "=")) {

            return decodeURIComponent(
                trimmedCookie.substring(name.length + 1)
            );
        }
    }

    return "";
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(text) {

    if (!messageBox) {
        return;
    }

    messageBox.innerHTML = "";

    const message = document.createElement("div");

    message.className = "message";
    message.textContent = text;

    messageBox.appendChild(message);

    setTimeout(() => {

        if (message) {
            message.remove();
        }

    }, 3000);
}


/* =========================================================
   TASK MODAL
   ========================================================= */

async function openModal() {

    modal.classList.remove("hidden");

    document.getElementById("title").focus();

    // Load team members into Assigned To dropdown.
    await loadPeopleIntoDropdown();
}


function closeModal() {

    modal.classList.add("hidden");

    taskForm.reset();
}


document
    .getElementById("openModalButton")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("closeModalButton")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        closeModal
    );


/* =========================================================
   LOAD TASKS
   ========================================================= */

async function loadTasks() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Could not load tasks."
            );
        }


        const tasks =
            await response.json();


        renderTasks(tasks);


    } catch (error) {

        showMessage(
            "Could not connect to the backend."
        );

        console.error(error);
    }
}


/* =========================================================
   RENDER TASKS
   ========================================================= */

function renderTasks(tasks) {

    todoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    let todoTotal = 0;
    let progressTotal = 0;
    let doneTotal = 0;


    tasks.forEach((task) => {

        const card =
            createTaskCard(task);


        if (task.status === "todo") {

            todoTasks.appendChild(card);

            todoTotal++;

        } else if (
            task.status === "in_progress"
        ) {

            progressTasks.appendChild(card);

            progressTotal++;

        } else if (
            task.status === "done"
        ) {

            doneTasks.appendChild(card);

            doneTotal++;
        }
    });


    showEmptyMessage(todoTasks);
    showEmptyMessage(progressTasks);
    showEmptyMessage(doneTasks);


    todoCount.textContent = todoTotal;
    progressCount.textContent = progressTotal;
    doneCount.textContent = doneTotal;
}


/* =========================================================
   EMPTY COLUMN MESSAGE
   ========================================================= */

function showEmptyMessage(container) {

    if (container.children.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-message";

        empty.textContent =
            "No tasks here yet.";

        container.appendChild(empty);
    }
}


/* =========================================================
   TASK CARD
   ========================================================= */

function createTaskCard(task) {

    const card =
        document.createElement("article");

    card.className =
        "task-card";


    /* Task title */

    const title =
        document.createElement("h3");

    title.textContent =
        task.title;


    /* Task description */

    const description =
        document.createElement("p");

    description.className =
        "task-description";

    description.textContent =
        task.description;


    card.appendChild(title);

    card.appendChild(description);


    /* Assigned person */

    if (task.assigned_to) {

        const assigned =
            document.createElement("p");

        assigned.className =
            "assigned-person";

        assigned.textContent =
            "Assigned to: " +
            task.assigned_to;

        card.appendChild(assigned);
    }


    /* Card actions */

    const actions =
        document.createElement("div");

    actions.className =
        "card-actions";


    /* Previous */

    if (task.status !== "todo") {

        const previousButton =
            document.createElement("button");

        previousButton.className =
            "action-button";

        previousButton.textContent =
            "← Previous";


        previousButton.addEventListener(
            "click",
            () => {

                moveTask(
                    task.id,
                    getPreviousStatus(
                        task.status
                    )
                );
            }
        );


        actions.appendChild(
            previousButton
        );

    } else {

        const emptySpace =
            document.createElement("span");

        actions.appendChild(
            emptySpace
        );
    }


    /* Delete */

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-button";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteTask(
                task.id,
                task.title
            );
        }
    );


    actions.appendChild(
        deleteButton
    );


    /* Next */

    if (task.status !== "done") {

        const nextButton =
            document.createElement("button");

        nextButton.className =
            "action-button";

        nextButton.textContent =
            "Next →";


        nextButton.addEventListener(
            "click",
            () => {

                moveTask(
                    task.id,
                    getNextStatus(
                        task.status
                    )
                );
            }
        );


        actions.appendChild(
            nextButton
        );
    }


    card.appendChild(actions);

    return card;
}


/* =========================================================
   STATUS HELPERS
   ========================================================= */

function getNextStatus(
    currentStatus
) {

    const currentIndex =
        STATUS_ORDER.indexOf(
            currentStatus
        );

    return STATUS_ORDER[
        currentIndex + 1
    ];
}


function getPreviousStatus(
    currentStatus
) {

    const currentIndex =
        STATUS_ORDER.indexOf(
            currentStatus
        );

    return STATUS_ORDER[
        currentIndex - 1
    ];
}


/* =========================================================
   CREATE TASK
   ========================================================= */

taskForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const assignedTo =
            document
                .getElementById("assignedTo")
                .value
                .trim();


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "X-CSRFToken":
                                getCookie(
                                    "csrftoken"
                                ),
                        },

                        body: JSON.stringify({

                            title: title,

                            description:
                                description,

                            assigned_to:
                                assignedTo,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Could not create task."
                );
            }


            closeModal();


            showMessage(
                "Task created successfully."
            );


            loadTasks();


        } catch (error) {

            showMessage(
                error.message
            );

            console.error(error);
        }
    }
);


/* =========================================================
   MOVE TASK
   ========================================================= */

async function moveTask(
    taskId,
    newStatus
) {

    try {

        const response =
            await fetch(
                `${API_URL}${taskId}/`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            ),
                    },

                    body: JSON.stringify({

                        status:
                            newStatus,

                    }),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not move task."
            );
        }


        showMessage(
            "Task status updated."
        );


        loadTasks();


    } catch (error) {

        showMessage(
            error.message
        );

        console.error(error);
    }
}


/* =========================================================
   DELETE TASK
   ========================================================= */

async function deleteTask(
    taskId,
    taskTitle
) {

    const confirmed =
        confirm(
            `Are you sure you want to delete "${taskTitle}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}${taskId}/`,
                {

                    method: "DELETE",

                    headers: {

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            ),
                    },
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not delete task."
            );
        }


        showMessage(
            "Task deleted."
        );


        loadTasks();


    } catch (error) {

        showMessage(
            error.message
        );

        console.error(error);
    }
}


/* =========================================================
   PEOPLE / TEAM
   ========================================================= */


/* ---------------- Open Team Modal ---------------- */

if (teamButton) {

    teamButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (teamModal) {

                teamModal.classList.remove(
                    "hidden"
                );

                loadPeople();
            }
        }
    );
}


/* ---------------- Close Team Modal ---------------- */

if (closeTeamModal) {

    closeTeamModal.addEventListener(
        "click",
        function () {

            teamModal.classList.add(
                "hidden"
            );
        }
    );
}


/* ---------------- Click Outside ---------------- */

if (teamModal) {

    teamModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                teamModal
            ) {

                teamModal.classList.add(
                    "hidden"
                );
            }
        }
    );
}


/* =========================================================
   LOAD PEOPLE
   ========================================================= */

async function loadPeople() {

    if (!peopleList) {
        return [];
    }


    try {

        const response =
            await fetch(
                PEOPLE_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Could not load people."
            );
        }


        const people =
            await response.json();


        peopleList.innerHTML = "";


        if (people.length === 0) {

            const empty =
                document.createElement(
                    "p"
                );

            empty.className =
                "empty-message";

            empty.textContent =
                "No team members added yet.";


            peopleList.appendChild(
                empty
            );

            return people;
        }


        people.forEach(
            (person) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "person-card";


                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "person-info";


                const name =
                    document.createElement(
                        "strong"
                    );

                name.textContent =
                    person.name;


                const email =
                    document.createElement(
                        "span"
                    );

                email.textContent =
                    person.email;


                info.appendChild(name);

                info.appendChild(email);


                const deleteButton =
                    document.createElement(
                        "button"
                    );

                deleteButton.className =
                    "delete-person-button";

                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePerson(
                            person.id
                        );
                    }
                );


                card.appendChild(info);

                card.appendChild(
                    deleteButton
                );


                peopleList.appendChild(
                    card
                );
            }
        );


        return people;


    } catch (error) {

        console.error(error);


        peopleList.innerHTML =
            "";


        const errorMessage =
            document.createElement(
                "p"
            );

        errorMessage.className =
            "empty-message";

        errorMessage.textContent =
            "Unable to load team members.";


        peopleList.appendChild(
            errorMessage
        );


        return [];
    }
}


/* =========================================================
   LOAD PEOPLE INTO ASSIGNED TO DROPDOWN
   ========================================================= */

async function loadPeopleIntoDropdown() {

    if (!assignedToSelect) {
        return;
    }


    try {

        const response =
            await fetch(
                PEOPLE_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Could not load team members."
            );
        }


        const people =
            await response.json();


        /* Clear old options */

        assignedToSelect.innerHTML = "";


        /* Default option */

        const defaultOption =
            document.createElement(
                "option"
            );

        defaultOption.value = "";

        defaultOption.textContent =
            "Select a team member";

        assignedToSelect.appendChild(
            defaultOption
        );


        /* Add team members */

        people.forEach(
            (person) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    person.name;


                option.textContent =
                    `${person.name} (${person.email})`;


                assignedToSelect.appendChild(
                    option
                );
            }
        );


    } catch (error) {

        console.error(error);


        assignedToSelect.innerHTML =
            "";


        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "Unable to load team members";


        assignedToSelect.appendChild(
            option
        );
    }
}


/* =========================================================
   ADD PERSON
   ========================================================= */

async function addPerson(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "personName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "personEmail"
            )
            .value
            .trim();


    if (!name || !email) {

        showMessage(
            "Name and email are required."
        );

        return;
    }


    try {

        const response =
            await fetch(
                PEOPLE_API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            ),
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                    }),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not add person."
            );
        }


        personForm.reset();


        showMessage(
            "Team member added successfully."
        );


        await loadPeople();


        // Also refresh the Assigned To dropdown.
        await loadPeopleIntoDropdown();


    } catch (error) {

        showMessage(
            error.message
        );

        console.error(error);
    }
}


/* =========================================================
   DELETE PERSON
   ========================================================= */

async function deletePerson(
    personId
) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this person from your team?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${PEOPLE_API_URL}${personId}/`,
                {

                    method: "DELETE",

                    headers: {

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            ),
                    },
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not delete person."
            );
        }


        showMessage(
            "Team member removed."
        );


        await loadPeople();


        // Refresh Assigned To dropdown.
        await loadPeopleIntoDropdown();


    } catch (error) {

        showMessage(
            error.message
        );

        console.error(error);
    }
}


/* =========================================================
   START APPLICATION
   ========================================================= */

loadTasks();