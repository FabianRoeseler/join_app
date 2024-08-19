let tasks = [];
let dbKeys = [];
let storedUsernames = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];
let checkStatus = true;

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

  selectedUsers.forEach(function(user) {
      const username = user.dataset.username;
      storedInitials.push(getInitials(username)); // Nutze die getInitials Funktion, um die Initialen korrekt zu generieren
  });

  return storedInitials;
}

function getInitials(username) {
  const names = username.split(' ');
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
  }
  return initials;
}


async function addTask() {
  let selectedUser = document.querySelectorAll(".assigned-user");
  let initials = storeInitials();

  // Alle ausgewählten Benutzer sammeln
  for (let c = 0; c < selectedUser.length; c++) {
      const element = selectedUser[c];
      const username = element.dataset.username;
      storedUsernames.push(username);
  }

  // Aufgabe mit allen gesammelten Benutzern speichern
  let taskTitle = document.getElementById("addTaskInputTitle");
  let descriptionName = document.getElementById("addTaskDiscriptionField");
  let taskDate = document.getElementById("addTaskInputDueDate");
  let categoryInput = document.getElementById("categoryInput");
  let prio = selectedPrio;
  let subtasksContent = document.getElementById("subtasksContent");
  let subtasks = Array.from(subtasksContent.getElementsByTagName("span")).map(span => span.textContent);

  let data = {
      title: taskTitle.value,
      description: descriptionName.value,
      assigned_to: initials,
      assigned_to_names: storedUsernames,
      due_date: taskDate.value,
      prio: prioArr,
      subtasks: ["subtask1", "subtask2"],
      subtasks_done: ["subtask3"], // Initial leer, kann später aktualisiert werden
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

  return await response.json();
}


async function deleteTask(i) {
  // Sortiere die Benutzer und ermittle den Benutzer anhand des Index
  closeTaskDetails();

  // let sortedTasks = Object.values(tasksArray);
  // console.log("sortedTasks",sortedTasks);
  // let taskId = Object.keys(tasksArray).find(
  //   (key) => tasksArray[key] === sortedTasks[i]
  // );
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
      // const key = dbKeys[index_to_do[i]];
      // console.log("key", key);

      document.getElementById("to_do").innerHTML += generateToDoHTML(
        element,
        i
      );
      renderIntialsinSmallTask(element, `assigned-initials-to-do${i}`);
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
      
      renderIntialsinSmallTask(element,`assigned-initials-in-progress${i}`);
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

      renderIntialsinSmallTask(element, `assigned-initials-await-feedback${i}`);
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
      renderIntialsinSmallTask(element, `assigned-initials-done${i}`);
    }
  }
}

function renderIntialsinSmallTask(element, initialsCont) {
  for (let i = 0; i < element.assigned_to.length; i++) {
    const initials = element.assigned_to[i];
    
    document.getElementById(initialsCont).innerHTML += `
      <div class="test-initials">${initials}</div>
    `; 
  }
}

function startDragging(id) {
  currentDraggedElement = id;
  // document.getElementById(`task${i}`).style = `transform: rotate(8deg)`;
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

function openTaskDetails(i) {
  document.getElementById("task-details-overlay").classList.remove("d-none");
  document.getElementById("task-details-overlay").style = `left: 0`;
  let taskDetails = document.getElementById("task-details-Popup");
  let task = tasks[i];

  taskDetails.innerHTML = generateTaskDetailsHTML(task, i);
  renderAssignedContacts(task);
  renderSubtasks(task);
}

function renderAssignedContacts(task) {
  let contacts = document.getElementById("assigned-contacts");
  contacts.innerHTML = "";

  for (let i = 0; i < task.assigned_to.length; i++) {
      const initials = task.assigned_to[i];
      const username = task.assigned_to_names[i];

      // Überprüfen, ob Benutzername oder Initialen undefiniert sind und überspringe das Rendering
      if (initials && username) {
          contacts.innerHTML += `
              <div class="assigned-single-contact">
                  <div class="test-initials">${initials}</div>
                  <span>${username}</span>
              </div>
          `;
      }
  }
}


function renderSubtasks(task) {
  let subtasks = document.getElementById("subtasks-details");
  subtasks.innerHTML = "";

  for (let i = 0; i < task.subtasks.length; i++) {
    subtasks.innerHTML += /*html*/ `
            <div class="subtask-cont">
                <div onclick="setSubtaskCheck(${i})">
                    <img id="checkbox${i}" src="../assets/img/checkbox-empty.svg">
                </div>
                <div>${task.subtasks[i]}</div>
            </div>
        `;
  }
}

function closeTaskDetails() {
  document.getElementById("task-details-overlay").classList.add("d-none");
  // document.getElementById('task-details-Popup').style = `left: 100%`;
}

function setSubtaskCheck(i) {
  let check = document.getElementById(`checkbox${i}`);

  if (checkStatus) {
    check.src = "../assets/img/checkbox-check.svg";
    checkStatus = false;
  } else {
    check.src = "../assets/img/checkbox-empty.svg";
    checkStatus = true;
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
