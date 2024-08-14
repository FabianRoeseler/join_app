let tasks = [];
let taskKeys = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];
let checkStatus = true;
let currentId = 4;

const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTasks() {
  tasks = []
  let response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.tasks) {
    tasksArray = data.tasks;
    let ObjEntries = Object.entries(tasksArray);
    for (let index = 0; index < ObjEntries.length; index++) {
      const task = ObjEntries[index][1];
      const taskKey = ObjEntries[index][0];
      tasks.push(task);
      taskKeys.push(taskKey);
    }
    console.log("Tasks Array:", tasksArray); // remove later
    console.log("tasks", tasks);
    console.log("ObjEntries", ObjEntries);
    console.log("taskKeys", taskKeys);
    
    updateHTML();
  }
}

async function addTask(path = "tasks") {
  /*  let taskName = document.getElementById("inputfield"); */ // define the inputfields by ID

  let data = {
    id : currentId++,
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation",
    assigned_to: ["AM", "EM", "MB"],
    due_date: "06/10/2024",
    prio: "medium",
    prio_img: "../assets/img/prio_medium.svg",
    category: ["User Story", "#0038FF"],
    subtasks: ["subtask1", "subtask2"],
    subtasks_done: ["subtask1"],
    progress: "",
    status: "to_do",

    /*         The Values of the Fields must be defined for the data!
      username: userNameInput.value,
      email: emailInput.value,
      contactNumber: phoneInput.value */
  };

  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await loadTasks();
  /* cleanInputFields(); */ // add a function to clean the inputfields
  return await response.json();
}

async function deleteTask(i) {
  // Sortiere die Benutzer und ermittle den Benutzer anhand des Index
  closeTaskDetails();

  let sortedTasks = Object.values(tasksArray);
  console.log("sortedTasks",sortedTasks);
  let taskId = Object.keys(tasksArray).find(
    (key) => tasksArray[key] === sortedTasks[i]
  );
  console.log("taskId",taskId);

  let response = await fetch(BASE_URL + "tasks/" + taskId + ".json", {
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
      const id = to_do[i].id;
      document.getElementById("to_do").innerHTML += generateToDoHTML(
        element,
        i, id
      );
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
      const id = in_progress[i].id;

      document.getElementById("in_progress").innerHTML +=
        generateInProgressHTML(element, i, id);
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
      const id = await_feedback[i].id;

      document.getElementById("await_feedback").innerHTML +=
        generateAwaitFeedbackHTML(element, i, id);
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
      const id = done[i].id;

      document.getElementById("done").innerHTML += generateDoneHTML(element, i, id);
    }
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
    document.getElementById(id).classList.add('highlight-category-cont');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('highlight-category-cont');
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
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasksArray),
  });
  return await response.json();
}

function openTaskDetails(id) {
    document.getElementById('task-details-overlay').classList.remove('d-none');
    let taskDetails = document.getElementById('task-details-Popup');
    // taskDetails.style = `left: 50%`;

    // console.log("status", id);
  
    for (let j = 0; j < tasks.length; j++) {
      if (tasks[j]["id"] === id) {
        let task = tasks[j];

    taskDetails.innerHTML = /*html*/`
        <div class="task-details">
            <div class="task-head">
                <div class="task-category-detail" style="background : ${task.category[1]}">${task.category[0]}</div>
                <img onclick="closeTaskDetails()" src="../assets/img/iconoir_cancel.svg" alt="close">
            </div>
            <span class="task-details-title">${task.title}</span>
            <span class="task-details-description">${task.description}</span>
            <div class="date-priority-style">
                <span class="task-subtitles">Due date:</span>
                <span>${task.due_date}</span>
            </div>
            <div class="date-priority-style">
                <span class="task-subtitles">Priority:</span>
                <div class="prio-cont">
                    <span>${task.prio}</span>
                    <img src="../assets/img/prio_medium.svg">
                </div>
            </div>
            <div class="assigned-to">
                <span class="task-subtitles">Assigned To:</span>
                <div id="assigned-contacts"></div>
            </div>
            <div class="subtasks-popup">
                <span class="task-subtitles">Subtasks</span>
                <div id="subtasks-details"></div>
            </div>
            <div class="delete-edit-cont">
            <div onclick="deleteTask(${j})" class="delete-edit-single">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_207322_4146" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_207322_4146)">
                        <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
                    </g>
                </svg>              
                <span>Delete</span>
            </div>
            <div class="separator-line"></div>
            <div class="delete-edit-single">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_207322_3882)">
                        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                    </g>
                </svg>              
                <span onclick="">Edit</span>
            </div>
            </div>

        </div>
    `;
    renderAssignedContacts();
    renderSubtasks();
  }
  } 
}

function renderAssignedContacts() {
    let contacts = document.getElementById('assigned-contacts');
    contacts.innerHTML = '';

    for (let i = 0; i < tasks[0].assigned_to.length; i++) {
        contacts.innerHTML += /*html*/ `
            <div class="assigned-single-contact">
                <div class="test-initials">${tasks[0].assigned_to[i]}</div>
                <span>Test Name</span>
            </div>
            `;
    }
}

function renderSubtasks() {
    let subtasks = document.getElementById('subtasks-details');
    subtasks.innerHTML = '';

    for (let i = 0; i < tasks[0].subtasks.length; i++) {
        subtasks.innerHTML += /*html*/`
            <div class="subtask-cont">
                <div onclick="setSubtaskCheck(${i})">
                    <img id="checkbox${i}" src="../assets/img/checkbox-empty.svg">
                </div>
                <div>${tasks[0].subtasks[i]}</div>
            </div>
        `;
    }
}

function closeTaskDetails() {
    document.getElementById('task-details-overlay').classList.add('d-none');
    // document.getElementById('task-details-Popup').style = `left: 100%`;
}

function setSubtaskCheck(i) {
    let check = document.getElementById(`checkbox${i}`);

    if (checkStatus) {
        check.src = '../assets/img/checkbox-check.svg';
        checkStatus = false;
    } else {
        check.src = '../assets/img/checkbox-empty.svg';
        checkStatus = true;
    }
}