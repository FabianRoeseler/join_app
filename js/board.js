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

/**
 * updates the index_done array to include the indices of tasks from the tasks array that have a status of "done".
 */
function saveKeyIndexDone() {
  index_done = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "done") {
      index_done.push(j);
    }
  }
}

/**
 * renders subtask progress and assigned user initials for a given task, based on the presence
 * 
 * @param {*} element 
 * @param {*} i 
 */
function firstIfCheckDone(element, i) {
  if ("subtasks" in element) {
    renderSubtaskProgress(element, `subtasks-progess-done${i}`);
  } else {
    document
      .getElementById(`subtasks-progess-done${i}`)
      .classList.add("d-none");
  }
  if ("assigned_users" in element) {
    renderIntialsinSmallTask(element, `assigned-initials-done${i}`);
  }
}

/**
 * displays the task description and priority for a given task, hiding these elements if they are not existing
 * 
 * @param {*} element 
 * @param {*} i 
 */
function secondIfCheckDone(element, i) {
  if ("description" in element) {
    renderTaskDescription(element, `task-description-done${i}`);
  } else {
    document
      .getElementById(`task-description-done${i}`)
      .classList.add("d-none");
  }
  if ("prio" in element) {
    renderTaskPrio(element, `task-prio-done${i}`)
  } else {
    document.getElementById(`task-prio-done${i}`).classList.add('d-none');
  }
}

/**
 * sets the currentDraggedElement variable to the provided id, indicating which element is currently being dragged.
 * 
 * @param {*} id 
 */
function startDragging(id) {
  // document.getElementById(`task${id}`).style = `transform: rotate(8deg)`;

  currentDraggedElement = id;
}

/**
 * prevents the default handling of a drag-and-drop event, allowing the dragged element to be dropped in the target area.
 * 
 * @param {*} ev 
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * highlights the container on dragging
 * 
 * @param {*} id 
 */
function highlightCont(id) {
  document.getElementById(id).classList.add("highlight-category-cont");
}

/**
 * removes highlight after dragging
 * 
 * @param {*} id 
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("highlight-category-cont");
}

/**
 * updates the status of the currently dragged task to the specified status
 * 
 * @param {*} status 
 */
function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  updateHTML();
  saveProgress();
}

/**
 * sets the status of the task with the specified id to "to_do"
 * 
 * @param {*} id 
 */
function moveToToDo(id) {
  tasks[id]["status"] = "to_do";
  updateHTML();
  saveProgress();
}

/**
 * sets the status of the task with the specified id to "in_progress"
 * 
 * @param {*} id 
 */
function moveToInProgress(id) {
  tasks[id]["status"] = "in_progress";
  updateHTML();
  saveProgress();
}

/**
 * sets the status of the task with the specified id to "await_feedback"
 * 
 * @param {*} id 
 */
function moveToAwaitFeedback(id) {
  tasks[id]["status"] = "await_feedback";
  updateHTML();
  saveProgress();
}

/**
 * sets the status of the task with the specified id to "done"
 * 
 * @param {*} id 
 */
function moveToDone(id) {
  tasks[id]["status"] = "done";
  updateHTML();
  saveProgress();
}

/**
 * toggles the visibility of the dropdown menu
 * 
 * @param {*} i 
 */
function toggleKebabDropdown(i) {
  document.getElementById(`kebab-dropdown${i}`).classList.toggle("d-none");
}

/**
 * saves the current state of tasksArray to a server at the specified path using a PUT request
 * 
 * @param {*} path 
 * @returns 
 */
async function saveProgress(path = "tasks") {
  let response = await fetch(ADD_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasksArray),
  });
  return await response.json();
}


// render functions for small task view

/**
 * updates the HTML content of the element with the specified id to display the description property of the provided element
 * 
 * @param {*} element 
 * @param {*} id 
 */
function renderTaskDescription(element, id) {
  document.getElementById(id).innerHTML = `${element.description}`;
}

/**
 * displays the progress of subtasks, showing a progress bar and a counter based on the number of completed and total subtasks
 * 
 * @param {*} element 
 * @param {*} id 
 */
function renderSubtaskProgress(element, id) {
  let progress = document.getElementById(id);

  if ("subtasks_done" in element) {
    progress.innerHTML = /*html*/ `
    <div id="subtask-progress">
        <div id="progress-bar" style="width:${(100 / element.subtasks.length) * element.subtasks_done.length
      }%"></div>
    </div>
    <div id="subtask-counter">${element.subtasks_done.length}/${element.subtasks.length
      } Subtasks</div>
    `;
  } else {
    progress.innerHTML = /*html*/ `
    <div id="subtask-progress">
        <div id="progress-bar" style="width:${(100 / element.subtasks.length) * 0
      }%"></div>
    </div>
    <div id="subtask-counter">0/${element.subtasks.length} Subtasks</div>
    `;
  }
}

/**
 * displays the initials of assigned users for a task, showing individual initials for up to 5 users and a summary indicator (+N) if there are more than 6 users
 * 
 * @param {*} element 
 * @param {*} initialsCont 
 */
function renderIntialsinSmallTask(element, initialsCont) {
  let users = element.assigned_users;
  if (users.length < 6) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      document.getElementById(initialsCont).innerHTML += `
        <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
      `;
    }
  }
  if (users.length > 6) {
    for (let i = 0; i < users.length - (users.length - 5); i++) {
      const user = users[i];
      document.getElementById(initialsCont).innerHTML += `
        <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
      `;
    }
    document.getElementById(initialsCont).innerHTML += `
      <div class="test-initials" style="background-color: #2A3647">+${users.length - 5}</div>
    `;
  }
}

/**
 * displays a priority icon for the task
 * 
 * @param {*} element 
 * @param {*} id 
 */
function renderTaskPrio(element, id) {
  document.getElementById(id).innerHTML = `<img class="prio-icons" src="${element.prio[1]
    }" alt="prio icon">`;
}

// end of render functions for small task view

/**
 * generates the Task Details HTML into PopUp and renders all Infos of the task
 * 
 * @param {*} i 
 */
function openTaskDetails(i) {
  document.getElementById("task-details-overlay").classList.remove("d-none");
  document.getElementById("task-details-overlay").style = `left: 0`;
  let taskDetails = document.getElementById("task-details-Popup");
  let task = tasks[i];

  taskDetails.innerHTML = generateTaskDetailsHTML(task, i);
  renderInfosInTaskDetails(task, i);
}

/**
 * updates the task details by conditionally rendering assigned user contacts and subtasks if those properties are present
 * 
 * @param {*} task 
 * @param {*} i 
 */
function renderInfosInTaskDetails(task, i) {
  if ("assigned_users" in task) {
    renderAssignedContacts(task);
  } else {
    document.getElementById(`assigned-users-cont${i}`).classList.add("d-none");
  }
  if ("subtasks" in task) {
    renderSubtasks(task, i);
  } else {
    document.getElementById(`subtasks-cont${i}`).classList.add("d-none");
  }
  renderInfosInTaskDetailsTwo(task, i);
}

/**
 * updates the task details by conditionally rendering the task description and priority if those properties are present
 * 
 * @param {*} task 
 * @param {*} i 
 */
function renderInfosInTaskDetailsTwo(task, i) {
  if ("description" in task) {
    renderDescriptionInTaskDetails(task, i);
  } else {
    document
      .getElementById(`task-details-description${i}`)
      .classList.add("d-none");
  }
  if ("prio" in task) {
    renderPrioInTaskDetails(task, i);
  } else {
    document.getElementById(`task-details-prio${i}`).classList.add('d-none');
  }
}


// render functions for detail task view

/**
 * displays the description of the task details
 * 
 * @param {*} task 
 * @param {*} i 
 */
function renderDescriptionInTaskDetails(task, i) {
  document.getElementById(
    `task-details-description${i}`
  ).innerHTML = `${task.description}`;
}

/**
 * displays the task's priority, including a capitalized priority label and an associated icon image
 * 
 * @param {*} task 
 * @param {*} i 
 */
function renderPrioInTaskDetails(task, i) {
  let prio = document.getElementById(`prio-cont${i}`);
  prio.innerHTML = /*html*/`
      <span>${task.prio[0].charAt(0).toUpperCase() + task.prio[0].slice(1)}</span>
      <img src="${task.prio[1]}">
  `;
}

/**
 * populates the assigned-contacts element with a list of assigned users for the given task, displaying each user's initials and username
 * 
 * @param {*} task 
 */
function renderAssignedContacts(task) {
  let contacts = document.getElementById("assigned-contacts");
  contacts.innerHTML = "";

  for (let i = 0; i < task.assigned_users.length; i++) {
    const user = task.assigned_users[i];

    contacts.innerHTML += `
              <div class="assigned-single-contact">
                  <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
                  <span>${user.username}</span>
              </div>
          `;
  }
}

/**
 * display a list of subtasks for the given task, including each subtask's description and a checkbox image that triggers a function to mark the subtask as done when clicked
 * 
 * @param {*} task 
 * @param {*} i 
 */
function renderSubtasks(task, i) {
  let subtasks = document.getElementById(`subtasks-details${i}`);
  subtasks.innerHTML = "";

  for (let j = 0; j < task.subtasks.length; j++) {
    subtasks.innerHTML += /*html*/ `
            <div class="subtask-cont">
                <div class="subtask-cont-img" onclick="moveToSubtasksDone(${i}, ${j})">
                    <img id="checkbox${j}" src="${task.subtasks[j].checkbox_img}">
                </div>
                <div>${task.subtasks[j].subtask}</div>
            </div>
        `;
  }
}

/**
 * renders the selected users in the edit PopUp
 */
function renderSelectedUsersEdit() {
  let selectedUsers = document.getElementById('contentAssignedUsers');
  selectedUsers.innerHTML = "";
  for (let i = 0; i < assignedUsersEdit.length; i++) {
    const user = assignedUsersEdit[i];

    getUserId(user.username);
  }
}

/**
 * retrieves user data from a database
 */
async function getUsersFromDB() {
  let response = await fetch(ADD_URL + "users" + ".json");
  const data = await response.json();
  let ObjValues = Object.values(data);
  console.log("ObjValues", ObjValues);
  userlist = [];
  for (let i = 0; i < ObjValues.length; i++) {
    const element = ObjValues[i];
    userlist.push(element);
  }
}

/**
 * fetches and sorts user data, finds the index of a user with a matching username
 * 
 * @param {*} user 
 */
async function getUserId(user) {
  await getUsersFromDB();
  let sortedUsers = Object.values(userlist).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let index = sortedUsers.findIndex((obj) => obj["username"] === user);
  assignedUsersEdit.splice(0,1);
  toggleUserSelectionBoard(index);
}

/**
 * Handles the userselection in the dropdown menu. Highlighting, selection, removing etc.
 * @param {*} index
 */
function toggleUserSelectionBoard(index) {
  let sortedUsers = Object.values(userlist).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
 
  let user = sortedUsers[index];
  let contactElementAssigned = document.getElementById(`contact-info${index}`);

  if (selectedUsers.has(user.username)) {
    selectedUsers.delete(user.username);
    removeUserFromSelection(user.username);
    contactElementAssigned.classList.remove("contact-card-click-assigned");
    contactElementAssigned
      .querySelector(".name-assigned")
      .classList.remove("contact-name-assigned");
  } else {
    selectedUsers.add(user.username);
    addUserToSelection(user, getInitials(user.username));
    contactElementAssigned.classList.add("contact-card-click-assigned");
    contactElementAssigned
      .querySelector(".name-assigned")
      .classList.add("contact-name-assigned");
  }
}

/**
 * populates the subtasksContent element with a list of subtasks from the subtasksEdit array
 */
function renderSubtasksEdit() {
  let selectedSubtasks = document.getElementById('subtasksContent');
  selectedSubtasks.innerHTML = "";
  for (let i = 0; i < subtasksEdit.length; i++) {
    const element = subtasksEdit[i];

    selectedSubtasks.innerHTML += /*html*/ `
    <li id="subtask-${i}" class="subtask-item">
        <div class="dot"></div>
        <div class="subtask-text">
            <span id="span-${i}" onclick="editSubtask('subtask-${i}', 'span-${i}', 'input-${i}')">${element.subtask}</span>
        </div>
        <div class="subtask-icon">
            <img onclick="editSubtask('subtask-${i}', 'span-${i}', 'input-${i}')" src="../assets/img/edit.svg" alt="edit">
            <div class="divider"></div>
            <img onclick="deleteFromSubtaskArr('${element.subtask}')" src="../assets/img/delete.svg" alt="delete">
        </div>
    </li>
    `;
  }

}

/**
 * removes a user with the specified username from the assignedUsersEdit array
 * 
 * @param {*} username 
 */
function removeFromUsersArr(username) {
  for (let i = 0; i < assignedUsersEdit.length; i++) {
    const element = assignedUsersEdit[i];
    if (element.username == username) {
      assignedUsersEdit.splice(i, 1);
    }
  }
  renderSelectedUsersEdit();
}

/**
 * removes a specified subtask from both the subtasksEdit and subtasksEdit_done arrays
 * 
 * @param {*} subtask 
 */
function deleteFromSubtaskArr(subtask) {
  for (let i = 0; i < subtasksEdit.length; i++) {
    const element = subtasksEdit[i];
    if (element.subtask == subtask) {
      subtasksEdit.splice(i, 1);
    }
  }
  for (let i = 0; i < subtasksEdit_done.length; i++) {
    const element = subtasksEdit_done[i];
    if (element == subtask) {
      subtasksEdit_done.splice(i, 1);
    }
  }
  renderSubtasksEdit();
}

// end of render functions for detail task view

/**
 * hides the task details overla
 */
function closeTaskDetails() {
  document.getElementById("task-details-overlay").classList.add("d-none");
  // document.getElementById('task-details-Popup').style = `left: 100%`;
}

/**
 * toggles the completion status of a subtask by updating its checkbox image and corresponding status in the task's subtasks_done array
 * 
 * @param {*} i 
 * @param {*} j 
 */
function moveToSubtasksDone(i, j) {
  let check = document.getElementById(`checkbox${j}`);
  let task = tasks[i];
  let subtask = task.subtasks[j].subtask;

  if (task.subtasks[j]["checkbox_img"] === "../assets/img/checkbox-empty.svg") {
    checkSubtasksStatus(check, task, subtask, i, j);
  } else {
    check.src = "../assets/img/checkbox-empty.svg";
    task.subtasks[j]["checkbox_img"] = "../assets/img/checkbox-empty.svg";
    let index = task["subtasks_done"].indexOf(subtask);
    task.subtasks_done.splice(index, 1);
    saveProgress();
    updateHTML();
  }
}

/**
 * updates the status of a subtask by marking it as completed with a checked checkbox image
 * 
 * @param {*} check 
 * @param {*} task 
 * @param {*} subtask 
 * @param {*} i 
 * @param {*} j 
 */
function checkSubtasksStatus(check, task, subtask, i, j) {
  if ("subtasks_done" in tasks[i]) {
    subtasksArr_done = tasks[i].subtasks_done;
    check.src = "../assets/img/checkbox-check.svg";
    subtasksArr_done.push(subtask);
    tasks[i].subtasks_done = subtasksArr_done;
    task.subtasks[j]["checkbox_img"] = "../assets/img/checkbox-check.svg";
    saveProgress();
    updateHTML();
  } else {
    subtasksArr_done = [];
    check.src = "../assets/img/checkbox-check.svg";
    subtasksArr_done.push(subtask);
    tasks[i].subtasks_done = subtasksArr_done;
    task.subtasks[j]["checkbox_img"] = "../assets/img/checkbox-check.svg";
    saveProgress();
    updateHTML();
  }
}

/**
 * fetches tasks from database, filters them based on a search input (matching title or description)
 */
async function findTask() {
  tasks = [];
  dbKeys = [];
  let response = await fetch(ADD_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.tasks) {
    tasksArray = data.tasks;
    let ObjEntries = Object.entries(tasksArray);
    for (let index = 0; index < ObjEntries.length; index++) {
      const task = ObjEntries[index][1];
      tasks.push(task);
    }
  }

  let search = document.getElementById("search-input").value;
  let filter = tasks.filter(
    (x) =>
      x.title.toLowerCase().includes(search.toLowerCase()) ||
      x.description.toLowerCase().includes(search.toLowerCase())
  );
  tasks = filter;

  updateHTML();
}

/**
 * This function generates the Task Details Edit HTML into PopUp, fetches Data from Task and fill it into Edit Form
 * 
 * @param {number} i - index number for selected task
 */
async function openEdit(i) {
  let taskDetails = document.getElementById("task-details-Popup");
  taskDetails.innerHTML = generateTaskDetailsEditHTML(i);

  let taskKey = dbKeys[i];

  let response = await fetch(ADD_URL + "tasks/" + taskKey + ".json");
  const data = await response.json();

  fillEditForm(data);
}

/**
 * This function fills the data into Edit Form
 * 
 * @param {object} data - data with all information about the selected task
 */
function fillEditForm(data) {
  let title = document.getElementById('editTitle');
  let description = document.getElementById('editDescription');
  let date = document.getElementById('editDueDate');

  categoryArr.push(data.category[0]);
  categoryArr.push(data.category[1]);

  title.value = data.title;

  if ("description" in data) {
    description.value = data.description;
  }

  date.value = data.due_date;

  firstcheckIfKeysInData(data);
  secondCheckIfKeysInData(data);
}

/**
 * This function checks if the keys "prio" & "assigned_users" are used in the selected task
 * 
 * @param {object} data - data with all information about the selected task
 */
function firstcheckIfKeysInData(data) {
  if ("prio" in data) {
    document.getElementById(data.prio[0]).click();
    prioArrEdit.push(data.prio[0]);
    prioArrEdit.push(data.prio[1]);
  }
  if ("assigned_users" in data) {
    assignedUsersEdit = [];
    for (let i = 0; i < data.assigned_users.length; i++) {
      const user = data.assigned_users[i];
      assignedUsersEdit.push({ "initials": `${user.initials}`, "username": `${user.username}`, "color": `${user.color}` });
    }
    renderSelectedUsersEdit();
  }
}

/**
 * This function checks if the keys "subtasks" & "subtasks_done" are used in the selected task
 * 
 * @param {object} data - data with all information about the selected task
 */
function secondCheckIfKeysInData(data) {
  if ("subtasks" in data) {
    subtasksEdit = [];
    for (let i = 0; i < data.subtasks.length; i++) {
      const element = data.subtasks[i];

      subtasksEdit.push({ "checkbox_img": `${element.checkbox_img}`, "subtask": `${element.subtask}` });
    }
    renderSubtasksEdit();
  }
  if ("subtasks_done" in data) {
    subtasksEdit_done = [];
    for (let i = 0; i < data.subtasks_done.length; i++) {
      const element = data.subtasks_done[i];

      subtasksEdit_done.push(element.subtask);
    }
  }
}

/**
 * This function save the edited infos and patches it back to DB
 * 
 * @param {number} i - index number for selected task
 * @returns 
 */
async function saveEdit(i) {  
  let taskTitle = document.getElementById("editTitle");
  let descriptionName = document.getElementById("editDescription");
  let taskDate = document.getElementById("editDueDate");
  let data = {
    title: taskTitle.value,
    description: descriptionName.value,
    assigned_users: assignedUsersEdit,
    due_date: taskDate.value,
    prio: prioArrEdit,
    subtasks: subtasksEdit,
  };

  let taskKey = dbKeys[i];
  let response = await fetch(ADD_URL + "tasks/" + taskKey + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  showEditSuccessPopUp();
  setTimeout(() => {
    location.href = "../html/board.html";
    updateHTML();
  }, 2000);
  return await response.json();

}

/**
 * This function generates Task Details HTML into PopUp and renders all Infos of Task
 * 
 * @param {number} i - index number for selected task
 */
function closeEdit(i) {
  let task = tasks[i];
  let taskDetails = document.getElementById("task-details-Popup");
  taskDetails.innerHTML = generateTaskDetailsHTML(task, i);
  renderInfosInTaskDetails(task, i);
}

/**
 * This function shows a PopUp with Info that the changes were successfully commited
 */
function showEditSuccessPopUp() {
  let editSuccessElement = document.getElementById("edit-success");
  editSuccessElement.style.display = 'flex';  // Popup einblenden
  setTimeout(() => {
    editSuccessElement.style.transform = 'translate(-50%, -50%)';  // Slidet in die Mitte
    editSuccessElement.style.opacity = '1';  // Sichtbar machen
  }, 500);  // Kurze Verzögerung für den Slide-Effekt

  setTimeout(closeEditSuccessPopUp, 3000);  // Popup nach einer Weile ausblenden
}

/**
 * This function hides again the PopUp with Info that the changes were successfully commited
 */
function closeEditSuccessPopUp() {
  let editSuccessElement = document.getElementById("edit-success");
  editSuccessElement.style.transform = 'translate(100%, -50%)';  // Slidet wieder nach rechts
  editSuccessElement.style.opacity = '0';  // Unsichtbar machen
  setTimeout(() => {
    editSuccessElement.style.display = 'none';  // Popup ausblenden
  }, 500);  // Wartezeit für den Slide-Out-Effekt
}


