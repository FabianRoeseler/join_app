let selectedPrio = null;
let categoriesContainerClick = false;
let assignedContainerClick = false;
let userList = [];
let subtaskIdCounter = 0;
let categories = [
  {
    category: "User Story",
    "bg-color": "#0038FF",
  },
  {
    category: "Technical Task",
    "bg-color": "#1FD7C1",
  },
];
let prioArr = [];
let prioArrEdit = [];
let subtasksArr = [];
let subtasksEdit = [];
let subtasksArr_done = [];
let categoryArr = [];
let assignedUsersArr = [];
let assignedUsersEdit = [];
let selectedUsers = new Set();

/**
 * Adding Firebase Realtime Database URL
 */
const ADDTASK_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Toggle button function. Handles which button is active/checked and unchecks the others
 * @param {*} prioState
 */
function toggleButton(prioState) {
  prioArrEdit = [];
  let button = document.getElementById(prioState);
  let img = document.getElementById(prioState + "Img");

  if (selectedPrio === prioState) {
    button.classList.remove(`btn-${prioState}-active`);
    img.src = `../assets/img/Prio_${prioState}_color.png`;
    selectedPrio = null;
  } else {
    let priorities = ["urgent", "medium", "low"];
    priorities.forEach((priority) => {
      let otherButton = document.getElementById(priority);
      let otherImg = document.getElementById(priority + "Img");
      otherButton.classList.remove(`btn-${priority}-active`);
      otherImg.src = `../assets/img/Prio_${priority}_color.png`;
    });
    button.classList.add(`btn-${prioState}-active`);
    img.src = `../assets/img/Prio_${prioState}_white.png`;
    selectedPrio = prioState;
    prioArr = [];
    let prioImgSource = `../assets/img/prio_${prioState}.svg`;
    prioArr.push(prioState);
    prioArr.push(prioImgSource);
    prioArrEdit.push(prioState);
    prioArrEdit.push(prioImgSource);
  }
}

/**
 * Category function
 * render categories in dropdown menu
 */
function renderCategories() {
  let categoryContainer = document.getElementById("dropDownCategoryMenu");
  categoryContainer.innerHTML = "";

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]["category"];
    const catColor = categories[i]["bg-color"];

    categoryContainer.innerHTML += `
        <div class="addtask-category" onclick="selectCategory('${category}', '${catColor}')">
          ${category}
        </div>
      `;
  }
}

/**
 * Handles the category dropdown. activation,highlighting and selection
 * @param {*} categoryTask
 * @param {*} catColor
 */
function selectCategory(categoryTask, catColor) {
  let categoryInput = document.getElementById("categoryInput");
  let categoryList = document.getElementById("dropDownCategoryMenu");

  categoryInput.value = categoryTask;
  hideCategories();
  categoryList.style.border = "0px";
  categoryArr = [];
  categoryArr.push(categoryTask);
  categoryArr.push(catColor);
}

/**
 * Opens/closes the dropdown menu for the categorys, icon switch etc.
 */
function openCategories() {
  let categoryList = document.getElementById("dropDownCategoryMenu");
  let icon = document.getElementById("arrowDropMenuCategory");
  icon.style.transform = "rotate(180deg)";
  categoryList.innerHTML = "";
  if (!categoriesContainerClick) {
    categoriesContainerClick = true;
    categoryList.style.border = "1px solid #CDCDCD";
    renderCategories();
  } else {
    categoriesContainerClick = false;
    categoryList.style.border = "0px";
    hideCategories();
  }
  document.getElementById("categoryInput").classList.toggle("outline");
}

function hideCategories() {
  categoriesContainerClick = false;
  let categoryList = document.getElementById("dropDownCategoryMenu");
  let icon = document.getElementById("arrowDropMenuCategory");
  icon.style.transform = "rotate(0deg)";
  categoryList.innerHTML = "";
}

/**
 * Assigned to function
 * Picks the initials of the selected username due array methods
 * Changes size of the first characters and returns the result
 * @param {*} username
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
 * Fetching data from the Database
 * @returns
 */
async function fetchContactsFromAPI() {
  try {
    let response = await fetch(ADDTASK_URL + ".json");
    const data = await response.json();
    if (data && typeof data === "object" && data.users) {
      return Object.values(data.users);
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

async function loadContacts() {
  userList = await fetchContactsFromAPI();
}

/**
 * Opening the dropdown for the userlist and loading the acutal listed users
 */
async function showUsers() {
  let userListElement = document.getElementById("dropDownUserMenu");
  let icon = document.getElementById("arrowDropMenuAssigned");
  icon.style.transform = "rotate(180deg)";
  await loadContacts();
  if (!assignedContainerClick) {
    assignedContainerClick = true;
    userListElement.style.border = "1px solid #CDCDCD";
    displayDropdownUserList(userList);
  } else {
    assignedContainerClick = false;
    userListElement.style.border = "0px";
    hideUsers();
  }
  document.getElementById("userNameInput").classList.toggle("outline");
}

function displayDropdownUserList(userList) {
  let dropdownMenu = document.getElementById("dropDownUserMenu");
  dropdownMenu.innerHTML = "";
  let sortedUsers = Object.values(userList).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let lastInitial = "";
  sortedUsers.forEach((user, i) => {
    let color = user.color || generateRandomColor();
    let initial = user.username[0].toUpperCase();
    if (initial !== lastInitial) {
      lastInitial = initial;
    }
    let isSelected = selectedUsers.has(user.username);
    let additionalClass = isSelected ? "contact-card-click-assigned" : "";
    dropdownMenu.innerHTML += /*html*/ `
      <div onclick="toggleUserSelection(${i})" id="contact-info${i}" class="contact-assigned ${additionalClass}">
        <div class="initials" style="background-color: ${color};">${getInitials(
      user.username
    )}</div>
        <div class="contact-info">
          <p id="name${i}" class="name-assigned ${
      isSelected ? "contact-name-assigned" : ""
    }">
            <span>${user.username}</span>
          </p>
        </div>
      </div>
    `;
  });
}

/**
 * Handles the userselection in the dropdown menu. Highlighting, selection, removing etc.
 * @param {*} index
 */
function toggleUserSelection(index) {
  let sortedUsers = Object.values(userList).sort((a, b) =>
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

function addUserToSelection(user, userInitials) {
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");
  let userDiv = document.createElement("div");
  userDiv.className = "assigned-user";
  userDiv.dataset.username = user.username;
  userDiv.innerHTML = `
        <div class="rendered-initials-cont">
            <div class="initials" style="background-color: ${
              user.color || generateRandomColor()
            };">
                ${getInitials(user.username)}
            </div>
        </div>
    `;

  contentAssignedUsers.appendChild(userDiv);
  assignedUsersArr.push({
    initials: `${userInitials}`,
    username: `${user.username}`,
    color: `${user.color}`,
  });
  assignedUsersEdit.push({
    initials: `${userInitials}`,
    username: `${user.username}`,
    color: `${user.color}`,
  });
}

function removeUserFromSelection(username) {
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");
  let userDiv = Array.from(contentAssignedUsers.children).find(
    (child) => child.dataset.username === username
  );
  if (userDiv) {
    contentAssignedUsers.removeChild(userDiv);
  }
  for (let i = 0; i < assignedUsersArr.length; i++) {
    const element = assignedUsersArr[i];
    if (element.username == username) {
      assignedUsersArr.splice(i, 1);
    }
  }
  for (let i = 0; i < assignedUsersEdit.length; i++) {
    const element = assignedUsersEdit[i];
    if (element.username == username) {
      assignedUsersEdit.splice(i, 1);
    }
  }
}

/**
 * Closing the user dropdown menu and changes state of the dropdown
 */
function hideUsers() {
  assignedContainerClick = false;
  let userListElement = document.getElementById("dropDownUserMenu");
  let icon = document.getElementById("arrowDropMenuAssigned");
  icon.style.transform = "rotate(0deg)";
  userListElement.innerHTML = "";
}

/**
 * Filters the userlist shown in dropdown menu
 * @returns
 */
function filterUsers() {
  if (!Array.isArray(userList) || userList.length === 0) {
    return;
  }
  const searchTerm = document
    .getElementById("userNameInput")
    .value.toLowerCase();
  const filteredUsers = Object.values(userList).filter((user) =>
    user.username.toLowerCase().includes(searchTerm)
  );

  displayDropdownUserList(filteredUsers);
}

/**
 * Subtask functions. Add, counter, creating li element, setting IDs for DOM Elements
 * and creating the HTML.
 */
function addSubtask() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtasksContent = document.getElementById("subtasksContent");

  if (subtaskInput.value.trim() !== "") {
    subtaskIdCounter++;
    const liId = "subtask-" + subtaskIdCounter;
    const spanId = "span-" + subtaskIdCounter;
    const inputId = "input-" + subtaskIdCounter;
    const newSubtaskHTML = /*html*/ `
    <li id="${liId}" class="subtask-item">
        <div class="dot"></div>
        <div class="subtask-text">
            <span id="${spanId}" onclick="editSubtask('${liId}', '${spanId}', '${inputId}')">${subtaskInput.value}</span>
        </div>
        <div class="subtask-icon">
            <img onclick="editSubtask('${liId}', '${spanId}', '${inputId}')" src="../assets/img/edit.svg" alt="edit">
            <div class="divider"></div>
            <img onclick="deleteSubtask('${liId}')" src="../assets/img/delete.svg" alt="delete">
        </div>
    </li>
`;
    subtasksArr.push({
      checkbox_img: "../assets/img/checkbox-empty.svg",
      subtask: `${subtaskInput.value}`,
    });
    subtasksEdit.push({
      checkbox_img: "../assets/img/checkbox-empty.svg",
      subtask: `${subtaskInput.value}`,
    });
    subtasksContent.innerHTML += newSubtaskHTML;
    subtaskInput.value = "";
  }
  document.getElementById("clear-add-icons").classList.add("d-none");
  document.getElementById("subtasks-plus-icon").classList.remove("d-none");
}

/**
 * Subtask edit function
 * @param {*} liId
 * @param {*} spanId
 * @param {*} inputId
 */
function editSubtask(liId, spanId, inputId) {
  const spanElement = document.getElementById(spanId);
  const li = document.getElementById(liId);
  const currentText = spanElement.textContent;

  const editSubtaskHTML = /*html*/ `
        <div class="subtask-input-wrapper edit-mode">
            <input id="${inputId}" class="edit-subtask-input" type="text" value="${currentText}">
            <div class="input-icons-edit">
                <img src ="../assets/img/deletecopy.svg" onclick="deleteSubtask('${liId}')">
                <div class="divider"></div>
                <img src="../assets/img/check1.svg" onclick="saveSubtask('${liId}', '${inputId}', '${spanId}')">
            </div>
        </div>
    `;

  li.innerHTML = editSubtaskHTML;
  li.classList.add("subtask-item-on-focus");
  li.classList.remove("subtask-item");
}

/**
 * Saving edited subtask
 * @param {*} liId
 * @param {*} inputId
 * @param {*} spanId
 */
function saveSubtask(liId, inputId, spanId) {
  const li = document.getElementById(liId);
  const input = document.getElementById(inputId);
  const saveSubtaskHTML = `
        <div class="subtask-text">
            <div class="dot"></div>
            <span id="span-${liId}" onclick="editSubtask('${liId}', 'span-${liId}', 'input-${liId}')">${input.value}</span>
        </div>
        <div class="subtask-icon">
            <img onclick="editSubtask('${liId}', '${spanId}', '${inputId}')" src="../assets/img/edit.svg" alt="edit">
            <div class="divider"></div>
            <img id="deleteBtn-${liId}" onclick="deleteSubtask('${liId}')" src="../assets/img/delete.svg" alt="delete">
        </div>
    `;

  li.innerHTML = saveSubtaskHTML;
  li.classList.remove("subtask-item-on-focus");
  li.classList.add("subtask-item");
}

/**
 * Deleting Subtasks
 * @param {*} liId
 */
function deleteSubtask(liId) {
  const li = document.getElementById(liId);
  li.remove();
}

/**
 * Clearing inputfields from Subtask
 */
function clearSubtaskInput() {
  document.getElementById("subtaskInput").value = "";
}

function clearSubtaskInput() {
  const input = document.getElementById("subtaskInput");
  input.value = "";
  document.getElementById("clearButton").style.display = "none";
}

function showClearButton() {
  document.getElementById("clear-add-icons").classList.remove("d-none");
  document.getElementById("subtasks-plus-icon").classList.add("d-none");
}

function clearImput() {
  document.getElementById("subtaskInput").value = "";
}

/**
 * Successpopup for adding a task. Opening, closing
 */
function showTaskCreatedPopUp() {
  if (window.innerWidth < 1350) {
    document.getElementById("task-success").style = `left: 30px;`;
  } else {
    document.getElementById("task-success").style = `left: 64px;`;
  }
  setTimeout(closeTaskCreatedPopUp, 1200);
}

function closeTaskCreatedPopUp() {
  document.getElementById("task-success").style = `left: 100%;`;
}

/**
 * Click outside event for dropdown closing
 * @param {*} event
 */
function handleClickOutside(event) {
  let categoryList = document.getElementById("dropDownCategoryMenu");
  let categoryIcon = document.getElementById("arrowDropMenuCategory");

  let userListElement = document.getElementById("dropDownUserMenu");
  let userIcon = document.getElementById("arrowDropMenuAssigned");
  if (!categoryList.contains(event.target) && event.target !== categoryIcon) {
    hideCategories();
  }
  if (!userListElement.contains(event.target) && event.target !== userIcon) {
    hideUsers();
  }
}

document.addEventListener("click", handleClickOutside);
