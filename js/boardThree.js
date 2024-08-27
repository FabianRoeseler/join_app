/**
 * retrieves user data from a database
 */
async function getUsersFromDB() {
  let response = await fetch(ADD_URL + "users" + ".json");
  const data = await response.json();
  let ObjValues = Object.values(data);
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
  assignedUsersEdit.splice(0, 1);
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
  let selectedSubtasks = document.getElementById("subtasksContent");
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
  let title = document.getElementById("editTitle");
  let description = document.getElementById("editDescription");
  let date = document.getElementById("editDueDate");

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
      assignedUsersEdit.push({
        initials: `${user.initials}`,
        username: `${user.username}`,
        color: `${user.color}`,
      });
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

      subtasksEdit.push({
        checkbox_img: `${element.checkbox_img}`,
        subtask: `${element.subtask}`,
      });
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
  editSuccessElement.style.display = "flex"; // Popup einblenden
  setTimeout(() => {
    editSuccessElement.style.transform = "translate(-50%, -50%)"; // Slidet in die Mitte
    editSuccessElement.style.opacity = "1"; // Sichtbar machen
  }, 500); // Kurze Verzögerung für den Slide-Effekt

  setTimeout(closeEditSuccessPopUp, 3000); // Popup nach einer Weile ausblenden
}

/**
 * This function hides again the PopUp with Info that the changes were successfully commited
 */
function closeEditSuccessPopUp() {
  let editSuccessElement = document.getElementById("edit-success");
  editSuccessElement.style.transform = "translate(100%, -50%)"; // Slidet wieder nach rechts
  editSuccessElement.style.opacity = "0"; // Unsichtbar machen
  setTimeout(() => {
    editSuccessElement.style.display = "none"; // Popup ausblenden
  }, 500); // Wartezeit für den Slide-Out-Effekt
}
