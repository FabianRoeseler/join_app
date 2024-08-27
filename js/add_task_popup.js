/**
 * Opens the 'Add Task' popup by sliding it into view, displaying the overlay, setting up the close event listener, and toggling the button state to "medium".
 */
function openAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "50%";
  overlayAddTaskPopup.style.display = "flex";
  overlayAddTaskPopup.addEventListener("click", closeAddTaskPopupByOverlay);
  toggleButton("medium");
}

/**
 * Closes the 'Add Task' popup by sliding it out of view, hiding the overlay, and removing the close event listener.
 */
function closeAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "-1200px";
  overlayAddTaskPopup.style.display = "none";
  overlayAddTaskPopup.removeEventListener("click", closeAddTaskPopupByOverlay);
}

/**
 * Closes the 'Add Task' popup if the overlay is clicked by checking if the event target's ID is "overlayAddTaskPopup".
 */
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

/**
 * Validates the task due date input. Displays an error message if the date is invalid, otherwise clears the error and proceeds to validate the task category.
 * @returns {boolean} Returns false if the date is invalid, otherwise proceeds to the next validation step.
 */
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

/**
 * Validates the task category input. Displays an error message if no category is selected, otherwise clears the error and proceeds to add the task.
 * @returns {boolean} Returns false if no category is selected, otherwise proceeds to add the task.
 */
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

/**
 * Validates the task title input in the popup. Displays an error message if the title is empty, otherwise clears the error and proceeds to validate the task date.
 * @returns {boolean} Returns false if the title is empty, otherwise proceeds to validate the task date.
 */
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
