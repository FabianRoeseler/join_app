let tasks = [];
let currentDraggedElement;
let index_to_do = [];
let index_in_progress = [];
let index_await_feedback = [];
let index_done = [];

const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTasks() {
  let response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.tasks) {
    tasksArray = data.tasks;
    let ObjEntries = Object.entries(tasksArray);
    for (let index = 0; index < ObjEntries.length; index++) {
      const task = ObjEntries[index][1];
      tasks.push(task);
    }
    console.log("Tasks Array:", tasksArray); // remove later
    console.log("tasks", tasks);
    updateHTML();
  }
}

async function addTask(path = "tasks") {
  /*  let taskName = document.getElementById("inputfield"); */ // define the inputfields by ID

  let data = {
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
  let sortedTasks = Object.values(tasksArray);
  console.log(sortedTasks);
  let taskId = Object.keys(tasksArray).find(
    (key) => tasksArray[key] === sortedTasks[i]
  );
  console.log(taskId);

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
      document.getElementById("to_do").innerHTML += generateToDoHTML(
        element,
        i
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
      document.getElementById("in_progress").innerHTML +=
        generateInProgressHTML(element, i);
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
      document.getElementById("await_feedback").innerHTML +=
        generateAwaitFeedbackHTML(element, i);
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
      document.getElementById("done").innerHTML += generateDoneHTML(element, i);
    }
  }
}

<<<<<<< HEAD
function generateToDoHTML(element, i) {
  return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${
          index_to_do[i]
        })" class="task">
            <div class="task-head">
                <div class="task-category" style="background : ${
                  element.category[1]
                }">${element.category[0]}</div>
                <img onclick="toggleKebabDropdown(${
                  index_to_do[i]
                })" src="../assets/img/kebab.svg" alt="more options">
                <div id="kebab-dropdown${
                  index_to_do[i]
                }" class="kebab-dropdown d-none">
                    <p>Move to</p>
                    <span onclick="moveToInProgress(${
                      index_to_do[i]
                    })">In progress</span>
                    <span onclick="moveToAwaitFeedback(${
                      index_to_do[i]
                    })">Await feedback</span>
                    <span onclick="moveToDone(${index_to_do[i]})">Done</span>
                </div>
            
            </div>
            <span id="task-title">${element.title}</span>
            <span id="task-description">${element.description}</span>
            <div class="subtasks">
                <div id="subtask-progress">
                    <div id="progress-bar" style="width:${
                      (100 / element.subtasks.length) *
                      element.subtasks_done.length
                    }%"></div>
                </div>
                <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
            </div>
            <div class="assigned-prio-cont">
                <div id="assigned-initials">
                    <div class="test-initials">${element.assigned_to[0]}</div>
                    <div class="test-initials bg-green">${
                      element.assigned_to[1]
                    }</div>
                    <div class="test-initials bg-violet">${
                      element.assigned_to[2]
                    }</div>
                </div>
                <div id="task-prio">
                    <img class="prio-icons" src="${
                      element.prio_img
                    }" alt="prio icon">
                </div>
            </div>
        </div>
    `;
}

function generateInProgressHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_in_progress[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_in_progress[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_in_progress[i]
                  }" class="kebab-dropdown d-none">
                        <p>Move to</p>
                        <span onclick="moveToInProgress(${
                          index_in_progress[i]
                        })">In progress</span>
                        <span onclick="moveToAwaitFeedback(${
                          index_in_progress[i]
                        })">Await feedback</span>
                        <span onclick="moveToDone(${
                          index_in_progress[i]
                        })">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}

function generateAwaitFeedbackHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_await_feedback[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_await_feedback[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_await_feedback[i]
                  }" class="kebab-dropdown d-none">
                        <p>Move to</p>
                        <span onclick="moveToInProgress(${
                          index_await_feedback[i]
                        })">In progress</span>
                        <span onclick="moveToAwaitFeedback(${
                          index_await_feedback[i]
                        })">Await feedback</span>
                        <span onclick="moveToDone(${
                          index_await_feedback[i]
                        })">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}

function generateDoneHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_done[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_done[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_done[i]
                  }" class="kebab-dropdown d-none">
                        <p>Move to</p>
                        <span onclick="moveToInProgress(${
                          index_done[i]
                        })">In progress</span>
                        <span onclick="moveToAwaitFeedback(${
                          index_done[i]
                        })">Await feedback</span>
                        <span onclick="moveToDone(${index_done[i]})">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}

=======
>>>>>>> 8efcb25 (optimized sub-optimal code)
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
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
