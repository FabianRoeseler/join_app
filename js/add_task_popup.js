function openAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "50%"; // Popup nach links schieben
  overlayAddTaskPopup.style.display = "flex"; // Overlay sichtbar machen
  overlayAddTaskPopup.addEventListener("click", closeAddTaskPopupByOverlay); // Event-Listener hinzufügen
}

function closeAddTaskPopup() {
  let addTaskPopup = document.getElementById("addTaskPopup");
  let overlayAddTaskPopup = document.getElementById("overlayAddTaskPopup");

  addTaskPopup.style.right = "-1200px"; // Popup nach rechts außerhalb des Bildschirms verschieben
  overlayAddTaskPopup.style.display = "none"; // Overlay unsichtbar machen
  overlayAddTaskPopup.removeEventListener("click", closeAddTaskPopupByOverlay); // Event-Listener entfernen
}

function closeAddTaskPopupByOverlay(event) {
  if (event.target.id === "overlayAddTaskPopup") {
    closeAddTaskPopup();
  }
}

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
