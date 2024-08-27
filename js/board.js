let tasks = [];
let dbKeys = [];
let storedUsernames = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];
let userlist = [];

const ADD_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

  /**
   * Retrieves task data and updates the HTML content accordingly
   */
async function loadTasks() {
  tasks = [];
  dbKeys = [];
  let response = await fetch(ADD_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.tasks) {
    tasksArray = data.tasks;
    let ObjEntries = Object.entries(tasksArray);
    for (let index = 0; index < ObjEntries.length; index++) {
      const task = ObjEntries[index][1];
      const dbkey = ObjEntries[index][0];
      tasks.push(task);
      dbKeys.push(dbkey);
    }
    updateHTML();
  }
}

/**
 * collects the initials of all selected users, processes these usernames through the getInitials function, and returns an array of the generated initials.
 * 
 * @returns 
 */
function storeInitials() {
  let selectedUsers = document.querySelectorAll(".assigned-user");
  let storedInitials = [];

  selectedUsers.forEach(function (user) {
    const username = user.dataset.username;
    storedInitials.push(getInitials(username)); // Nutze die getInitials Funktion, um die Initialen korrekt zu generieren
  });
  return storedInitials;
}


/**
 * generates and returns the initials of a given username
 * 
 * @param {string} username 
 * @returns 
 */
function getInitials(username) {
  const names = username.split(" ");
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    initials += names[1].charAt(0).toUpperCase();
  }
  return initials;
}


/**
 * submits a new task's details , shows a confirmation popup, and then redirects the user to the board page
 * 
 * @returns 
 */
async function addTask() {
  let taskTitle = document.getElementById("addTaskInputTitle");
  let descriptionName = document.getElementById("addTaskDiscriptionField");
  let taskDate = document.getElementById("addTaskInputDueDate");
  let data = {
    title: taskTitle.value,
    description: descriptionName.value,
    assigned_users: assignedUsersArr,
    due_date: taskDate.value,
    prio: prioArr,
    subtasks: subtasksArr,
    category: categoryArr,
    status: "to_do",
  };

  let response = await fetch(ADD_URL + "/tasks" + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  showTaskCreatedPopUp();
  setTimeout(function () {
    location.href = "../html/board.html";
  }, 1200);

  return await response.json();
}

/**
 * submits a new task's details , shows a confirmation popup, and then redirects the user to the board page
 * 
 * @returns 
 */
async function addTaskPopupBoard() {
  let taskTitle = document.getElementById("addTaskPopupInputTitle");
  let descriptionName = document.getElementById("addTaskPopupDiscriptionField");
  let taskDate = document.getElementById("addTaskPopupInputDueDate");
  let data = {
    title: taskTitle.value,
    description: descriptionName.value,
    assigned_users: assignedUsersArr,
    due_date: taskDate.value,
    prio: prioArr,
    subtasks: subtasksArr,
    category: categoryArr,
    status: "to_do",
  };
  let response = await fetch(ADD_URL + "/tasks" + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  location.href = "../html/board.html";
  return await response.json();
}

/**
 * deletes a task specified by its index from the server
 * 
 * @param {*} i 
 * @returns 
 */
async function deleteTask(i) {
  closeTaskDetails();

  let taskKey = dbKeys[i];
  let response = await fetch(ADD_URL + "tasks/" + taskKey + ".json", {
    method: "DELETE",
  });
  await loadTasks();
  return await response.json();
}

/**
 * update the HTML content of the four container to do, in progress, await feedback & done
 */
function updateHTML() {
  updateToDoHTML();
  updateInProgressHTML();
  updateAwaitFeedbackHTML();
  updateDoneHTML();
}

/**
 * updates the HTML content of the "to_do" section
 */
function updateToDoHTML() {
  saveKeyIndexToDo();
  let to_do = tasks.filter((t) => t["status"] == "to_do");
  let to_do_container = document.getElementById("to_do");
  if (to_do.length == 0) {
    to_do_container.innerHTML = /*html*/ `<div id="to-do-placeholder" class="cat-placeholder">No tasks To do</div>`;
  } else {
    document.getElementById("to_do").innerHTML = "";
    for (let i = 0; i < to_do.length; i++) {
      const element = to_do[i];
      document.getElementById("to_do").innerHTML += generateToDoHTML(element, i);
      firstIfCheckToDo(element, i);
      secondIfCheckToDo(element, i);
    }
  }
}

/**
 * updates the index_to_do array to include the indices of tasks from the tasks array that have a status of "to_do".
 */
function saveKeyIndexToDo() {
  index_to_do = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "to_do") {
      index_to_do.push(j);
    }
  }
}

/**
 * renders subtask progress and assigned user initials for a given task, based on the presence
 * 
 * @param {*} element 
 * @param {*} i 
 */
function firstIfCheckToDo(element, i) {
  if ("subtasks" in element) {
    renderSubtaskProgress(element, `subtasks-progess-to-do${i}`);
  } else {
    document
      .getElementById(`subtasks-progess-to-do${i}`)
      .classList.add("d-none");
  }
  if ("assigned_users" in element) {
    renderIntialsinSmallTask(element, `assigned-initials-to-do${i}`);
  }
}

/**
 * displays the task description and priority for a given task, hiding these elements if they are not existing
 * 
 * @param {*} element 
 * @param {*} i 
 */
function secondIfCheckToDo(element, i) {
  if ("description" in element) {
    renderTaskDescription(element, `task-description-to-do${i}`);
  } else {
    document
      .getElementById(`task-description-to-do${i}`)
      .classList.add("d-none");
  }
  if ("prio" in element) {
    renderTaskPrio(element, `task-prio-to-do${i}`)
  } else {
    document.getElementById(`task-prio-to-do${i}`).classList.add('d-none');
  }
}

/**
 * updates the HTML content of the "in_progress" section
 */
function updateInProgressHTML() {
  saveKeyIndexInProgress();
  let in_progress = tasks.filter((t) => t["status"] == "in_progress");
  let in_progress_container = document.getElementById("in_progress");
  if (in_progress.length == 0) {
    in_progress_container.innerHTML = /*html*/ `<div id="in-progress-placeholder" class="cat-placeholder">No tasks In progress</div>`;
  } else {
    document.getElementById("in_progress").innerHTML = "";
    for (let i = 0; i < in_progress.length; i++) {
      const element = in_progress[i];
      document.getElementById("in_progress").innerHTML += generateInProgressHTML(element, i);
      firstIfCheckInProgress(element, i);
      secondIfCheckInProgress(element, i);
    }
  }
}

/**
 * updates the index_in_progress array to include the indices of tasks from the tasks array that have a status of "in_progress".
 */
function saveKeyIndexInProgress() {
  index_in_progress = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "in_progress") {
      index_in_progress.push(j);
    }
  }
}

/**
 * renders subtask progress and assigned user initials for a given task, based on the presence
 * 
 * @param {*} element 
 * @param {*} i 
 */
function firstIfCheckInProgress(element, i) {
  if ("subtasks" in element) {
    renderSubtaskProgress(element, `subtasks-progess-in-progress${i}`);
  } else {
    document
      .getElementById(`subtasks-progess-in-progress${i}`)
      .classList.add("d-none");
  }
  if ("assigned_users" in element) {
    renderIntialsinSmallTask(element, `assigned-initials-in-progress${i}`);
  }
}

/**
 * displays the task description and priority for a given task, hiding these elements if they are not existing
 * 
 * @param {*} element 
 * @param {*} i 
 */
function secondIfCheckInProgress(element, i) {
  if ("description" in element) {
    renderTaskDescription(element, `task-description-in-progress${i}`);
  } else {
    document
      .getElementById(`task-description-in-progress${i}`)
      .classList.add("d-none");
  }
  if ("prio" in element) {
    renderTaskPrio(element, `task-prio-in-progress${i}`)
  } else {
    document.getElementById(`task-prio-in-progress${i}`).classList.add('d-none');
  }
}

/**
 * updates the HTML content of the "await_feedback" section
 */
function updateAwaitFeedbackHTML() {
  saveKeyIndexAwaitFeedback();
  let await_feedback = tasks.filter((t) => t["status"] == "await_feedback");
  let await_feedback_container = document.getElementById("await_feedback");
  if (await_feedback.length == 0) {
    await_feedback_container.innerHTML = /*html*/ `<div id="await-feedback-placeholder" class="cat-placeholder">No tasks Await feedback</div>`;
  } else {
    document.getElementById("await_feedback").innerHTML = "";
    for (let i = 0; i < await_feedback.length; i++) {
      const element = await_feedback[i];
      document.getElementById("await_feedback").innerHTML +=
        generateAwaitFeedbackHTML(element, i);
      firstIfCheckAwaitFeedback(element, i);
      secondIfCheckAwaitFeedback(element, i);
    }
  }
}

/**
 * updates the index_await_feedback array to include the indices of tasks from the tasks array that have a status of "await_feedback".
 */
function saveKeyIndexAwaitFeedback() {
  index_await_feedback = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "await_feedback") {
      index_await_feedback.push(j);
    }
  }
}

/**
 * renders subtask progress and assigned user initials for a given task, based on the presence
 * 
 * @param {*} element 
 * @param {*} i 
 */
function firstIfCheckAwaitFeedback(element, i) {
  if ("subtasks" in element) {
    renderSubtaskProgress(element, `subtasks-progess-await-feedback${i}`);
  } else {
    document
      .getElementById(`subtasks-progess-await-feedback${i}`)
      .classList.add("d-none");
  }
  if ("assigned_users" in element) {
    renderIntialsinSmallTask(
      element,
      `assigned-initials-await-feedback${i}`
    );
  }
}

/**
 * displays the task description and priority for a given task, hiding these elements if they are not existing
 * 
 * @param {*} element 
 * @param {*} i 
 */
function secondIfCheckAwaitFeedback(element, i) {
  if ("description" in element) {
    renderTaskDescription(element, `task-description-await-feedback${i}`);
  } else {
    document
      .getElementById(`task-description-await-feedback${i}`)
      .classList.add("d-none");
  }
  if ("prio" in element) {
    renderTaskPrio(element, `task-prio-await-feedback${i}`)
  } else {
    document.getElementById(`task-prio-await-feedback${i}`).classList.add('d-none');
  }
}

/**
 * updates the HTML content of the "done" section
 */
function updateDoneHTML() {
  saveKeyIndexDone();
  let done = tasks.filter((t) => t["status"] == "done");
  let done_container = document.getElementById("done");
  if (done.length == 0) {
    done_container.innerHTML = /*html*/ `<div id="done-placeholder" class="cat-placeholder">No tasks Done</div>`;
  } else {
    document.getElementById("done").innerHTML = "";
    for (let i = 0; i < done.length; i++) {
      const element = done[i];
      document.getElementById("done").innerHTML += generateDoneHTML(element, i);
      firstIfCheckDone(element, i);
      secondIfCheckDone(element, i);
    }
  }
}