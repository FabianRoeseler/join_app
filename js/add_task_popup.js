/**
 * Handles the add task popup, dnone and remove, moving in, out, click outside events.
 */
function openAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "50%";
  overlayAddTaskPopup.style.display = "flex";
  overlayAddTaskPopup.addEventListener("click", closeAddTaskPopupByOverlay);
  toggleButton("medium");
}

function closeAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "-1200px";
  overlayAddTaskPopup.style.display = "none";
  overlayAddTaskPopup.removeEventListener("click", closeAddTaskPopupByOverlay);
}

function closeAddTaskPopupByOverlay(event) {
  if (event.target.id === "overlayAddTaskPopup") {
    closeAddTaskPopup();
  }
}

/**
 * Starting the validationprocess from adding a new task, switching through the different fields, parts with regex and finally adding the task
 * @returns
 */
function validateTaskTitle() {
  let x = document.getElementById("addTaskInputTitle").value;
  let xName = document.getElementById("addTitleError");
  if (x == "") {
    xName.innerHTML = "Please enter a Title";
    return false;
  } else {
    xName.innerHTML = "";
    return validateTaskDate();
  }
}

function validateTaskDate() {
  let x = document.getElementById("addTaskInputDueDate").value;
  let xName = document.getElementById("addDateError");
  if (!/\d/.test(x)) {
    xName.innerHTML = "Please enter a valid Date";
    return false;
  } else {
    xName.innerHTML = "";
    return validateTaskCategory();
  }
}

function validateTaskCategory() {
  let x = document.getElementById("categoryInput").value;
  let xName = document.getElementById("addCategoryError");
  if (x == "") {
    xName.innerHTML = "Please select a Category";
    return false;
  } else {
    xName.innerHTML = "";
    return addTask();
  }
}

function validatePopupTaskTitle() {
  let x = document.getElementById("addTaskPopupInputTitle").value;
  let xName = document.getElementById("addPopupTitleError");
  if (x == "") {
    xName.innerHTML = "Please enter a Title";
    return false;
  } else {
    xName.innerHTML = "";
    return validatePopupTaskDate();
  }
}

function validatePopupTaskDate() {
  let x = document.getElementById("addTaskPopupInputDueDate").value;
  let xName = document.getElementById("addPopupDateError");
  if (!/\d/.test(x)) {
    xName.innerHTML = "Please enter a valid Date";
    return false;
  } else {
    xName.innerHTML = "";
    return validatePopupTaskCategory();
  }
}

function validatePopupTaskCategory() {
  let x = document.getElementById("categoryInput").value;
  let xName = document.getElementById("addPopupCategoryError");
  if (x == "") {
    xName.innerHTML = "Please select a Category";
    return false;
  } else {
    xName.innerHTML = "";
    return addTaskPopupBoard();
  }
}
