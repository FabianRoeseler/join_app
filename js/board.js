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
  "INSERT FIREBASE REALTIME DATABASE URL HERE";

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
 * sets the currentDraggedElement variable to the provided id, indicating which element is currently being dragged.
 * 
 * @param {*} id 
 */
function startDragging(id) {
  
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
 * hides the task details overla
 */
function closeTaskDetails() {
  document.getElementById("task-details-overlay").classList.add("d-none");
  // document.getElementById('task-details-Popup').style = `left: 100%`;
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
