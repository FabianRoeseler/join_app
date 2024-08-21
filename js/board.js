let tasks = [];
let dbKeys = [];
let storedUsernames = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];
// let checkStatusArr = [];

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

  location.href = "../html/board.html";

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
    }
  }
}

function renderIntialsinSmallTask(element, initialsCont) {
  for (let i = 0; i < element.assigned_users.length; i++) {
    const user = element.assigned_users[i];

    document.getElementById(initialsCont).innerHTML += `
      <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
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
      .getElementById(`task-description-await-feedback${i}`)
      .classList.add("d-none");
  }
}

function renderDescriptionInTaskDetails(task, i) {
  document.getElementById(
    `task-details-description${i}`
  ).innerHTML = `${task.description}`;
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
                <div onclick="moveToSubtasksDone(${i}, ${j})">
                    <img id="checkbox${j}" src="${task.subtasks[j].checkbox_img}">
                </div>
                <div>${task.subtasks[j].subtask}</div>
            </div>
        `;
  }
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

function renderTaskDescription(element, id) {
  document.getElementById(id).innerHTML = `${element.description}`;
}

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
