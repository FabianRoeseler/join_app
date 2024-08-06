let colors = [];

const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

let loadedUserArray = {};

// Laedt die Firebase DB Daten herunter und fuegt sich in das lokale "loadedUserArray".
async function loadData() {
  let response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.users) {
    loadedUserArray = data.users;
    console.log("Loaded User Array:", loadedUserArray); // remove later
    displayContacts(loadedUserArray);
  }
}

// Nimmt die Datenbankdaten und postet alle Kontakte auf die Seite
async function displayContacts(users) {
  let container = document.getElementById("contact-list"); // Chose the DIV Window to render the Contacts in
  container.innerHTML = ""; // Clearing Div Window

  let sortedUsers = Object.values(users).sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  let lastInitial = ""; // Variable zur Speicherung des letzten Buchstabens für Gruppierung

  for (let i = 0; i < sortedUsers.length; i++) {
    let user = sortedUsers[i];

    let color = generateRandomColor();
    colors.push(color);

    let initial = user.username[0].toUpperCase();
    if (initial !== lastInitial) {
      container.innerHTML += `<div class="contact-list-letter"><h3>${initial}</h3></div><hr>`;
      lastInitial = initial;
    }
    console.log(colors[0]);
    container.innerHTML += /*html*/ `
      <div onclick="renderContactDetails(${i})" class="contact">
        <div class="initials" style="background-color: ${color};">${getInitials(
      user.username
    )}</div>
          <div id="contact-info${i}" class="contact-info">
            <p id="name${i}" class="name"><span>${user.username}</span></p>
            <p class="email">${user.email}</p>
          </div>
        </div>
    `;
  }
}

function generateRandomColor() {
  const letters = "0123456789ABCDEF"; // Damit Zufällig eine Farbe erstellt wird aus dieser Kombination
  let color = "#"; // Startet die Farbe mit '#' damit Farbe gesetzt werden kann
  for (let i = 0; i < 6; i++) {
    // Schleife für 6 Zeichen, um eine vollständige Farbe zu erstellen
    color += letters[Math.floor(Math.random() * 16)]; // Wählt ein zufälliges Zeichen aus der Zifferkombination aus
  }
  return color; // Gibt die generierte Farbe zurück
}

async function addContactS(path = "users") {
  let userNameInput = document.getElementById("addInputNameA");
  let emailInput = document.getElementById("addInputEmailB");
  let phoneInput = document.getElementById("addInputPhoneC");

  if (!userNameInput || !emailInput || !phoneInput) {
    console.error("One or more input elements are missing.");
    return;
  }

  let data = {
    username: userNameInput.value,
    email: emailInput.value,
    contactNumber: phoneInput.value,
  };

  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  cleanInputFields();
  window.location.reload();
  return await response.json();
}

async function deleteContact(i) {
  // Sortiere die Benutzer und ermittle den Benutzer anhand des Index
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let userId = Object.keys(loadedUserArray).find(
    (key) => loadedUserArray[key] === sortedUsers[i]
  );

  let response = await fetch(BASE_URL + "users/" + userId + ".json", {
    method: "DELETE",
  });
  window.location.reload();
  return await response.json();
}

function cleanInputFields() {
  let userNameInput = document.getElementById("addInputNameA");
  let emailInput = document.getElementById("addInputEmailB");
  let phoneInput = document.getElementById("addInputPhoneC");

  if (userNameInput) userNameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
}

function renderContactDetails(i) {
  let contactDetail = document.getElementById("render-contact-details");
  let contactDetailsMobile = document.getElementById("render-contact-details-mobile");

  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let user = sortedUsers[i];

  if (window.innerWidth < 1170) {
    contactDetailsMobile.innerHTML = /*html*/ `
        <div class="render-details-head-mobile">
          <div id="initials-detail" class="profile-initials-mobile">${getInitials(user.username)}</div>
          <div class="profile-name-mobile">${user.username}</div>
        </div>
        </div>
        <div class="render-details-info">
            <div class="contact-info-headline-mobile">Contact Information</div>
            <div>
                <div class="single-info">
                    <span><b>Email</b></span>
                    <span><a href="mailto:${user.email}">${user.email}</a></span>
                </div>
                <div class="single-info">
                    <span><b>Phone</b></span>
                    <span>${user.contactNumber}</span>
                </div>
            </div>
        </div>
        <div onclick="openMobileEditMenu(); stop(event)" id="details-mobile-round-btn" class="details-mobile-round-btn">
          <img src="../assets/img/kebab-menu.svg" alt="kebab menu">
        </div>
        <div id="mobile-edit-menu">
            <div class="edit-delete-child">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_207322_3882)">
                        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                    </g>
                </svg>
                <span onclick="openEditContact(); renderEdit(${i})">Edit</span>
            </div>
            <div onclick="deleteContact(${i})" class="edit-delete-child">
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
          </div>
    `;
    document
      .getElementById("contact-details-mobile")
      .classList.remove("d-none");
  } else {
    contactDetail.innerHTML = /*html*/ `
      <div class="render-details-head">
          <div id="initials-detail" class="profile-initials">${getInitials(user.username)}</div>
              <div>
                  <div class="profile-name">${user.username}</div>
                  <div class="edit-delete-cont">
                      <div class="edit-delete-child">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                  <rect width="24" height="24" fill="#D9D9D9"/>
                              </mask>
                              <g mask="url(#mask0_207322_3882)">
                                  <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                              </g>
                          </svg>
                          <span onclick="openEditContact(); renderEdit(${i})">Edit</span>
                      </div>
                      <div onclick="deleteContact(${i})" class="edit-delete-child">
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
              </div>
          </div>
      </div>
      <div class="render-details-info">
          <div class="contact-info-headline">Contact Information</div>
          <div>
              <div class="single-info">
                  <span><b>Email</b></span>
                  <span><a href="mailto:${user.email}">${user.email}</a></span>
              </div>
              <div class="single-info">
                  <span><b>Phone</b></span>
                  <span>${user.contactNumber}</span>
              </div>
          </div>
      </div>
  `;

    contactDetail.style = `width: 100%; left: 0;`;
    document.getElementById("initials-detail").style.background = `${colors[i]}`;
  }
}

// Funktion um Intitialen aus einem Namen zu holen
function getInitials(name) {
  // Teilt den Namen in Wörter auf und holt das erste Zeichen jedes Wortes
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

async function saveContact() {
  let editNameInput = document.getElementById("editInputName");
  let editEmailInput = document.getElementById("editInputEmail");
  let editPhoneInput = document.getElementById("editInputPhone");

  if (!editNameInput || !editEmailInput || !editPhoneInput) {
    console.error("One or more input elements are missing.");
    return;
  }

  // Sammelt die neuen Daten aus den Eingabefeldern
  let updatedData = {
    username: editNameInput.value,
    email: editEmailInput.value,
    contactNumber: editPhoneInput.value,
  };

  // Verwendet den aktuell bearbeiteten Index
  let userIndex = window.currentlyEditingUserIndex;

  // Findet den Benutzer anhand des Index
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  if (userIndex < 0 || userIndex >= sortedUsers.length) {
    console.error("User index out of bounds.");
    return;
  }

  let userId = Object.keys(loadedUserArray).find(
    (key) => loadedUserArray[key] === sortedUsers[userIndex]
  );

  // Senden der aktualisierten Daten an die Datenbank
  let response = await fetch(BASE_URL + "users/" + userId + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  // Überprüfen auf Fehler bei der Anfrage
  if (!response.ok) {
    console.error("Failed to update the user.");
    return;
  }

  // Aktualisiert die Anzeige der Kontakte
  await loadData(); // Neuladen der Daten, um die geänderten Informationen anzuzeigen
  closeEditContactPopup(); // Schließen des Bearbeitungs-Popups
  window.location.reload();
}

function renderEdit(i) {
  window.currentlyEditingUserIndex = i; // Speichert den Index des aktuell bearbeiteten Benutzers

  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  if (i >= 0 && i < sortedUsers.length) {
    let user = sortedUsers[i];
    console.log(user);

    let editContainer = document.getElementById("editContact");
    editContainer.innerHTML = "";
    editContainer.innerHTML = /*html*/ `
    <div class="edit-contact-top-left-section">
      <img class="edit-contact-logo" src="../assets/img/join_logo_white.png" alt="">
      <h1 class="edit-contact-headline">Edit contact</h1>
      <div class="edit-contact-separator"></div>
    </div>
    <div class="edit-contact-bottom-right-section">
      <span class="edit-contact-avatar"></span>
      <div class="edit-contact-bottom-rightmost-section">
        <div type="reset" onclick="closeEditContactPopup()" id="contactCloseButton" class="edit-contact-close"></div>
        <form onsubmit="saveContact()" return false class="edit-contact-form">
          <div class="input-edit-container">
            <input class="edit-imput edit-imput-name" id="editInputName" type="text" placeholder="Name" value="${user.username}" required>
          </div>
          <div class="input-edit-container">
            <input class="edit-imput edit-imput-email" id="editInputEmail" type="email" placeholder="Email" value="${user.email}" required>
          </div>
          <div class="input-edit-container">
            <input class="edit-imput edit-imput-phone" id="editInputPhone" type="number" placeholder="Phone" value="${user.contactNumber}" required>
          </div>
      
        <div class="button-edit-container">
          <button onclick="deleteContact(${i})" class="btn-cancel">
            Delete
          </button>
          <button type="submit" class="btn-create btn-create:hover ::root">Save<img src="../assets/img/check.svg"></button>
          </form>
        </div> 
      </div>
    </div>
    `;
  } else {
    console.error("Benutzer nicht gefunden oder ungültiger Index:", i);
  }
}

function closeContactDetailsMobile() {
  document.getElementById("contact-details-mobile").classList.add("d-none");
}

function openMobileEditMenu() {
  document.getElementById("details-mobile-round-btn").style = `background-color: var(--darkLightBlue)`;
  document.getElementById('mobile-edit-menu').style = `right: 12px; width: 116px`;
}

function closeMobileEditMenu() {
  document.getElementById('mobile-edit-menu').style = `right: 0; width: 0`;
}

function stop(event) {
  event.stopPropagation()
}
