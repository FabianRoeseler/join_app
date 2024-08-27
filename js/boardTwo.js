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
  