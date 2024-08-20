// Globale Variable, um den aktuellen Prioritätszustand zu speichern
let selectedPrio = null;
let categoriesContainerClick = false;
let assignedContainerClick = false; // Zustand der Dropdown-Menüs (offen/geschlossen)
let userList = []; // Liste der Benutzer, die aus der Datenbank geladen werden
let subtaskIdCounter = 0; // Zähler für eindeutige IDs
let categories = [
  {
    "category" : "User Story",
    "bg-color" : "#0038FF"
  },
  {
    "category" : "Technical Task",
    "bg-color" : "#1FD7C1"
  }
  // "User Story",
  // "Technical Task",
  // "Feature",
  // "Bug",
  // "Documentation",
  // "Design",
  // "Testing QA",
  // "Analyse/Research",
];
let prioArr = [];
let subtasksArr = [];
let subtasksArr_done = ["test"];
let categoryArr = [];
let assignedUsersArr = [];

const ADDTASK_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";


function toggleButton(prioState) {
  let button = document.getElementById(prioState);
  let img = document.getElementById(prioState + "Img");

  // Überprüfen, ob der aktuelle Button bereits aktiv ist
  if (selectedPrio === prioState) {
    // Button deaktivieren
    button.classList.remove(`btn-${prioState}-active`);
    img.src = `../assets/img/Prio_${prioState}_color.png`;
    selectedPrio = null; // Kein Button ist mehr ausgewählt
  } else {
    // Alle anderen Buttons deaktivieren
    let priorities = ["urgent", "medium", "low"];
    priorities.forEach((priority) => {
      let otherButton = document.getElementById(priority);
      let otherImg = document.getElementById(priority + "Img");
      otherButton.classList.remove(`btn-${priority}-active`);
      otherImg.src = `../assets/img/Prio_${priority}_color.png`;
    });

    // Den geklickten Button aktivieren
    button.classList.add(`btn-${prioState}-active`);
    img.src = `../assets/img/Prio_${prioState}_white.png`;
    selectedPrio = prioState; // Speichere den aktivierten Button
    prioArr = [];
    let prioImgSource = `../assets/img/prio_${prioState}.svg`;
    prioArr.push(prioState);
    prioArr.push(prioImgSource);
  }
}

////////////Category function////////////////////////

// render categories in dropdown menu
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

// wirdt gewählen eine Kategorie für die neue Aufgabe
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

// open the dropdown menu
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

// close the dropdown menu
function hideCategories() {
  categoriesContainerClick = false;
  let categoryList = document.getElementById("dropDownCategoryMenu");
  let icon = document.getElementById("arrowDropMenuCategory");
  icon.style.transform = "rotate(0deg)";
  categoryList.innerHTML = "";
}

////////////Assigned to function////////////////////////

// Diese Funktion gibt die ersten Buchstaben jedes Wortes als Initialen zurück
function getInitials(username) {
  // Zerlegt den übergebenen Namen in ein Array, Leerzeichen dienen als Trennzeichen 
  const names = username.split(' ');
  
  // Nimmt den ersten Buchstaben des ersten Namens, wandelt ihn in einen Großbuchstaben
  let initials = names[0].charAt(0).toUpperCase();
  
  // Überprüft, ob mehr als ein Name vorhanden ist
  if (names.length > 1) {
      // der erste Buchstabe des zweiten Namens wird in einen Großbuchstaben umgewandelt
      initials += names[1].charAt(0).toUpperCase();
  }
  
  // Gibt die berechneten Initialen zurück
  return initials;
}


async function fetchContactsFromAPI() {
  try {
    let response = await fetch(ADDTASK_URL + ".json");
    const data = await response.json();
    if (data && typeof data === "object" && data.users) {
      console.log("Loaded User Array:", data.users); // remove later
      return data.users; // Rückgabe der Benutzerliste
    } else {
      console.error("Unexpected data format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Funktion lädt die Benutzerliste von einer API und weist sie der userList-Variable zu
async function loadContacts() {
  userList = await fetchContactsFromAPI();
}

// Funktion öffnet das Dropdown-Menü für Benutzer und lädt die Liste der Benutzer
async function showUsers() {
  let userListElement = document.getElementById("dropDownUserMenu");
  let icon = document.getElementById("arrowDropMenuAssigned");
  icon.style.transform = "rotate(180deg)";
  await loadContacts(); // Lade die Kontakte
  if (!assignedContainerClick) {
    assignedContainerClick = true;
    userListElement.style.border = "1px solid #CDCDCD";
    displayDropdownUserList(userList); // userList definiert und gefüllt
  } else {
    assignedContainerClick = false;
    userListElement.style.border = "0px";
    hideUsers();
  }
  document.getElementById("userNameInput").classList.toggle("outline");
}

// Funktion rendert die Liste der Benutzer im Dropdown-Menü
function displayDropdownUserList(userList) {
  let dropdownMenu = document.getElementById("dropDownUserMenu");
  dropdownMenu.innerHTML = "";
  console.log(userList);

  // Alphabetisch User sortieren
  let sortedUsers = Object.values(userList).sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  let lastInitial = ""; // Variable zur Speicherung des letzten Buchstabens für Gruppierung

  sortedUsers.forEach((user, i) => {
    let color = user.color || generateRandomColor(); // Verwende die gespeicherte Farbe, wenn vorhanden

    let initial = user.username[0].toUpperCase();
    if (initial !== lastInitial) {
      lastInitial = initial;
    }

    dropdownMenu.innerHTML += /*html*/ `
            <div onclick="toggleUserSelection(${i})" id="contact-info${i}" class="contact-assigned">
                <div class="initials" style="background-color: ${color};">${getInitials(
      user.username
    )}</div>
                <div class="contact-info">
                    <p id="name${i}" class="name-assigned"><span>${
      user.username
    }</span></p>
                </div>
            </div>
        `;
  });
}

// Funktion zum Auswählen und Anzeigen von Benutzern
function toggleUserSelection(index) {
  let sortedUsers = Object.values(userList).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let user = Object.values(sortedUsers)[index];
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");
  let selectedUsers = Array.from(contentAssignedUsers.children).map(
    (child) => child.dataset.username
  );

  let contactElementAssigned = document.getElementById(`contact-info${index}`);
  // Überprüfen, ob der Benutzer bereits ausgewählt ist
  if (selectedUsers.includes(user.username)) {
    // Benutzer entfernen
    removeUserFromSelection(user.username);
    // Entferne die Stile
    contactElementAssigned.classList.remove("contact-card-click-assigned");
    contactElementAssigned
      .querySelector(".name-assigned")
      .classList.remove("contact-name-assigned");
  } else {
    // Benutzer hinzufügen
    addUserToSelection(user, getInitials(user.username));
    // Füge die Stile hinzu
    contactElementAssigned.classList.add("contact-card-click-assigned");
    contactElementAssigned
      .querySelector(".name-assigned")
      .classList.add("contact-name-assigned");
    console.log("addUser", user);
    
  }
}

// Funktion zum Hinzufügen eines Benutzers zur Auswahl
function addUserToSelection(user, userInitials) {
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");

  // Erstellen eines neuen Elements für den ausgewählten Benutzer
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
            <img onclick="removeUserFromSelection('${
              user.username
            }')" class="rendered-user-initials-img" src="../assets/img/iconoir_cancel.svg" alt="close">
        </div>
    `;

  contentAssignedUsers.appendChild(userDiv);
  assignedUsersArr.push({"initials" : `${userInitials}`, "username" : `${user.username}`, "color" : `${user.color}`});
  // console.log("assignedUsersArr", assignedUsersArr);
}

// Funktion zum Entfernen eines Benutzers aus der Auswahl
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
      assignedUsersArr.splice(i,1);
    }
  }
  console.log("assignedUsersArr", assignedUsersArr);
  
}

// Funktion schließt das Benutzer-Dropdown-Menü und setzt den Zustand des Dropdown-Menüs auf geschlossen zurück
function hideUsers() {
  assignedContainerClick = false;
  let userListElement = document.getElementById("dropDownUserMenu");
  let icon = document.getElementById("arrowDropMenuAssigned");
  icon.style.transform = "rotate(0deg)";
  userListElement.innerHTML = "";
}

////////////Subtask function////////////////////////

// Funktion zum Hinzufügen einer Unteraufgabe
function addSubtask() {
  const subtaskInput = document.getElementById("subtaskInput");
  const subtasksContent = document.getElementById("subtasksContent");

  if (subtaskInput.value.trim() !== "") {
    subtaskIdCounter++; // Erhöhe den Zähler für die ID

    const liId = "subtask-" + subtaskIdCounter; // Erzeuge eine eindeutige ID für das li-Element
    const spanId = "span-" + subtaskIdCounter; // ID für das span-Element
    const inputId = "input-" + subtaskIdCounter; // ID für das Input-Element

    // Erstelle das neue li-Element als HTML-String
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
            <!-- <button onclick="deleteSubtask('${liId}')">🗑️</button> -->
        </div>
    </li>
`;
    subtasksArr.push(subtaskInput.value);
    checkStatusArr.push("../assets/img/checkbox-empty.svg");
    // Füge das neue li-Element zur bestehenden Liste hinzu
    subtasksContent.innerHTML += newSubtaskHTML;

    // console.log("subtasksArr", subtasksArr);
    console.log("checkStatusArr", checkStatusArr);
    
    

    subtaskInput.value = ""; // Leert das Eingabefeld
  }
  document.getElementById("clear-add-icons").classList.add("d-none");
  document.getElementById("subtasks-plus-icon").classList.remove("d-none");
}

// Funktion zum Bearbeiten einer Unteraufgabe
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

// Funktion zum Speichern einer bearbeiteten Unteraufgabe
function saveSubtask(liId, inputId, spanId) {
  const li = document.getElementById(liId); // Hole das li-Element
  const input = document.getElementById(inputId); // Hole das Input-Element

  // Übernehme den bearbeiteten Text und stelle die ursprüngliche Ansicht wieder her
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

  li.innerHTML = saveSubtaskHTML; // Setze den neuen Inhalt für das li-Element
  li.classList.remove("subtask-item-on-focus");
  li.classList.add("subtask-item");
}

// Funktion zum Löschen einer Unteraufgabe
function deleteSubtask(liId) {
  const li = document.getElementById(liId); // Hole das li-Element
  li.remove(); // Entferne das li-Element aus der Liste
}

// Funktion zum Leeren des Eingabefelds
function clearSubtaskInput() {
  document.getElementById("subtaskInput").value = ""; // Leert das Eingabefeld
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
