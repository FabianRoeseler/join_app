let tasks = [];
let dbKeys = [];
let storedUsernames = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];

const ADD_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

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
    console.log("Tasks Array:", tasksArray); // remove later
    console.log("tasks", tasks);
    console.log("ObjEntries", ObjEntries);
    console.log("dbKeys", dbKeys);

    updateHTML();
  }
}

function storeInitials() {
  let selectedUsers = document.querySelectorAll(".assigned-user");
  let storedInitials = [];

  selectedUsers.forEach(function (user) {
    const username = user.dataset.username;
    storedInitials.push(getInitials(username)); // Nutze die getInitials Funktion, um die Initialen korrekt zu generieren
  });

  return storedInitials;
}

function getInitials(username) {
  const names = username.split(" ");
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    initials += names[1].charAt(0).toUpperCase();
  }
  return initials;
}

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
  setTimeout(function() {
  location.href = "../html/board.html";
}, 1200);

  return await response.json();
}

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

async function deleteTask(i) {
  closeTaskDetails();

  let taskKey = dbKeys[i];
  console.log("taskKey", taskKey);

  let response = await fetch(ADD_URL + "tasks/" + taskKey + ".json", {
    method: "DELETE",
  });
  await loadTasks();
  return await response.json();
}

function updateHTML() {
  index_to_do = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "to_do") {
      index_to_do.push(j);
    }
  }
  let to_do = tasks.filter((t) => t["status"] == "to_do");
  let to_do_container = document.getElementById("to_do");
  if (to_do.length == 0) {
    to_do_container.innerHTML = /*html*/ `<div id="to-do-placeholder" class="cat-placeholder">No tasks To do</div>`;
  } else {
    document.getElementById("to_do").innerHTML = "";
    for (let i = 0; i < to_do.length; i++) {
      const element = to_do[i];

      document.getElementById("to_do").innerHTML += generateToDoHTML(
        element,
        i
      );
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
  }

  index_in_progress = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "in_progress") {
      index_in_progress.push(j);
    }
  }
  let in_progress = tasks.filter((t) => t["status"] == "in_progress");
  let in_progress_container = document.getElementById("in_progress");
  if (in_progress.length == 0) {
    in_progress_container.innerHTML = /*html*/ `<div id="in-progress-placeholder" class="cat-placeholder">No tasks In progress</div>`;
  } else {
    document.getElementById("in_progress").innerHTML = "";
    for (let i = 0; i < in_progress.length; i++) {
      const element = in_progress[i];
      // const key = dbKeys[index_in_progress[i]];
      // console.log("key", key);

      document.getElementById("in_progress").innerHTML +=
        generateInProgressHTML(element, i);

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
  }

  index_await_feedback = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "await_feedback") {
      index_await_feedback.push(j);
    }
  }
  let await_feedback = tasks.filter((t) => t["status"] == "await_feedback");
  let await_feedback_container = document.getElementById("await_feedback");
  if (await_feedback.length == 0) {
    await_feedback_container.innerHTML = /*html*/ `<div id="await-feedback-placeholder" class="cat-placeholder">No tasks Await feedback</div>`;
  } else {
    document.getElementById("await_feedback").innerHTML = "";
    for (let i = 0; i < await_feedback.length; i++) {
      const element = await_feedback[i];
      // const key = dbKeys[index_await_feedback[i]];
      // console.log("key", key);

      document.getElementById("await_feedback").innerHTML +=
        generateAwaitFeedbackHTML(element, i);

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
  }

  index_done = [];
  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j]["status"] === "done") {
      index_done.push(j);
    }
  }
  let done = tasks.filter((t) => t["status"] == "done");
  let done_container = document.getElementById("done");
  if (done.length == 0) {
    done_container.innerHTML = /*html*/ `<div id="done-placeholder" class="cat-placeholder">No tasks Done</div>`;
  } else {
    document.getElementById("done").innerHTML = "";
    for (let i = 0; i < done.length; i++) {
      const element = done[i];
      // const key = dbKeys[index_done[i]];
      // console.log("key", key);

      document.getElementById("done").innerHTML += generateDoneHTML(element, i);
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
  }
}

function startDragging(id) {
  // document.getElementById(`task${id}`).style = `transform: rotate(8deg)`;

  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function highlightCont(id) {
  document.getElementById(id).classList.add("highlight-category-cont");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("highlight-category-cont");
}

function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  updateHTML();
  saveProgress();
}

function moveToToDo(id) {
  tasks[id]["status"] = "to_do";
  updateHTML();
  saveProgress();
}

function moveToInProgress(id) {
  tasks[id]["status"] = "in_progress";
  updateHTML();
  saveProgress();
}

function moveToAwaitFeedback(id) {
  tasks[id]["status"] = "await_feedback";
  updateHTML();
  saveProgress();
}

function moveToDone(id) {
  tasks[id]["status"] = "done";
  updateHTML();
  saveProgress();
}

function toggleKebabDropdown(i) {
  document.getElementById(`kebab-dropdown${i}`).classList.toggle("d-none");
}

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

function renderTaskDescription(element, id) {
  document.getElementById(id).innerHTML = `${element.description}`;
}

function renderSubtaskProgress(element, id) {
  let progress = document.getElementById(id);

  if ("subtasks_done" in element) {
    progress.innerHTML = /*html*/ `
    <div id="subtask-progress">
        <div id="progress-bar" style="width:${
          (100 / element.subtasks.length) * element.subtasks_done.length
        }%"></div>
    </div>
    <div id="subtask-counter">${element.subtasks_done.length}/${
      element.subtasks.length
    } Subtasks</div>
    `;
  } else {
    progress.innerHTML = /*html*/ `
    <div id="subtask-progress">
        <div id="progress-bar" style="width:${
          (100 / element.subtasks.length) * 0
        }%"></div>
    </div>
    <div id="subtask-counter">0/${element.subtasks.length} Subtasks</div>
    `;
  }
}

function renderIntialsinSmallTask(element, initialsCont) {
  let users = element.assigned_users;
  if (users.length < 5) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      document.getElementById(initialsCont).innerHTML += `
        <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
      `;
    }
  } 
  if (users.length > 5) {
    for (let i = 0; i < users.length-(users.length-4); i++) {
      const user = users[i];
      document.getElementById(initialsCont).innerHTML += `
        <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
      `;
    }   
      document.getElementById(initialsCont).innerHTML += `
      <div class="test-initials" style="background-color: #2A3647">+${users.length - 4}</div>
    `;
  }
}

function renderTaskPrio(element, id) {
  document.getElementById(id).innerHTML = `<img class="prio-icons" src="${element.prio[1]
    }" alt="prio icon">`;
}

// end of render functions for small task view


function openTaskDetails(i) {
  document.getElementById("task-details-overlay").classList.remove("d-none");
  document.getElementById("task-details-overlay").style = `left: 0`;
  let taskDetails = document.getElementById("task-details-Popup");
  let task = tasks[i];

  taskDetails.innerHTML = generateTaskDetailsHTML(task, i);
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

function renderDescriptionInTaskDetails(task, i) {
  document.getElementById(
    `task-details-description${i}`
  ).innerHTML = `${task.description}`;
}

function renderPrioInTaskDetails(task, i) {
  let prio = document.getElementById(`prio-cont${i}`);
  prio.innerHTML = /*html*/`
      <span>${task.prio[0].charAt(0).toUpperCase() + task.prio[0].slice(1)}</span>
      <img src="${task.prio[1]}">
  `;
}

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

function renderSelectedUsersEdit() {
  let selectedUsers = document.getElementById('contentAssignedUsers');
  selectedUsers.innerHTML = "";
  for (let i = 0; i < assignedUsersEdit.length; i++) {
    const user = assignedUsersEdit[i];

    selectedUsers.innerHTML += /*html*/`
        <div class="rendered-initials-cont">
          <div class="initials" style="background-color: ${user.color};">
              ${user.initials}
          </div>
          <img onclick="removeFromUsersArr('${
            user.username
          }')" class="rendered-user-initials-img" src="../assets/img/iconoir_cancel.svg" alt="close">
      </div>            
      `;
    }
}

function renderSubtasksEdit() {
  let selectedSubtasks = document.getElementById('subtasksContent');
  selectedSubtasks.innerHTML = "";
  for (let i = 0; i < subtasksEdit.length; i++) {
    const element = subtasksEdit[i];

    const liId = "subtask-" + subtaskIdCounter; // Erzeuge eine eindeutige ID für das li-Element
    const spanId = "span-" + subtaskIdCounter; // ID für das span-Element
    const inputId = "input-" + subtaskIdCounter; // ID für das Input-Element

    selectedSubtasks.innerHTML += /*html*/ `
    <li id="${liId}" class="subtask-item">
        <div class="dot"></div>
        <div class="subtask-text">
            <span id="${spanId}" onclick="editSubtask('${liId}', '${spanId}', '${inputId}')">${element.subtask}</span>
        </div>
        <div class="subtask-icon">
            <img onclick="editSubtask('${liId}', '${spanId}', '${inputId}')" src="../assets/img/edit.svg" alt="edit">
            <div class="divider"></div>
            <img onclick="deleteFromSubtaskArr('${element.subtask}')" src="../assets/img/delete.svg" alt="delete">
        </div>
    </li>
    `;
  }

}

function removeFromUsersArr(username) {
  for (let i = 0; i < assignedUsersEdit.length; i++) {
    const element = assignedUsersEdit[i];
    if (element.username == username) {
      assignedUsersEdit.splice(i,1);
    }
  }
  renderSelectedUsersEdit();
}

function deleteFromSubtaskArr(subtask) {
  for (let i = 0; i < subtasksEdit.length; i++) {
    const element = subtasksEdit[i];
    if (element.subtask == subtask) {
      subtasksEdit.splice(i,1);
    }
  }
  renderSubtasksEdit();
}

// end of render functions for detail task view


function closeTaskDetails() {
  document.getElementById("task-details-overlay").classList.add("d-none");
  // document.getElementById('task-details-Popup').style = `left: 100%`;
}

function moveToSubtasksDone(i, j) {
  let check = document.getElementById(`checkbox${j}`);
  let task = tasks[i];
  let subtask = task.subtasks[j].subtask;

  if (task.subtasks[j]["checkbox_img"] === "../assets/img/checkbox-empty.svg") {
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
  } else {
    check.src = "../assets/img/checkbox-empty.svg";
    task.subtasks[j]["checkbox_img"] = "../assets/img/checkbox-empty.svg";
    let index = task["subtasks_done"].indexOf(subtask);
    task.subtasks_done.splice(index, 1);
    saveProgress();
    updateHTML();
  }
}

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
      // const dbkey = ObjEntries[index][0];
      tasks.push(task);
      // dbKeys.push(dbkey);
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

async function openEdit(i) {
  let taskDetails = document.getElementById("task-details-Popup");
  taskDetails.innerHTML = generateTaskDetailsEditHTML(i);

  let taskKey = dbKeys[i];
  
  let response = await fetch(ADD_URL + "tasks/" + taskKey + ".json");
  const data = await response.json();

  fillEditForm(data);
}

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

  if ("prio" in data) {
    document.getElementById(data.prio[0]).click();
    prioArrEdit.push(data.prio[0]);
    prioArrEdit.push(data.prio[1]);
  }

  if ("assigned_users" in data) {
    assignedUsersEdit = [];
    for (let i = 0; i < data.assigned_users.length; i++) {
      const user = data.assigned_users[i];      
      assignedUsersEdit.push({"initials" : `${user.initials}`, "username" : `${user.username}`, "color" : `${user.color}`});
      }
      renderSelectedUsersEdit();
  }

  if ("subtasks" in data) {
    subtasksEdit = [];
    for (let i = 0; i < data.subtasks.length; i++) {
      const element = data.subtasks[i];

      subtasksEdit.push({"checkbox_img" : `${element.checkbox_img}`, "subtask" : `${element.subtask}`});
      console.log("subtasksArr", subtasksArr);
    }
    renderSubtasksEdit();
  }
}


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

  location.href = "../html/board.html";
  updateHTML();

  return await response.json();

}

function closeEdit(i) {
  let task = tasks[i];
  let taskDetails = document.getElementById("task-details-Popup");
  taskDetails.innerHTML = generateTaskDetailsHTML(task, i);
}



