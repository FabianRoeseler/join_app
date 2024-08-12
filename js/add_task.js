// Globale Variable, um den aktuellen Prioritätszustand zu speichern
let selectedPrio = null;
let categoriesContainerClick = false;
let assignedContainerClick = false; // Zustand der Dropdown-Menüs (offen/geschlossen)
let userList = []; // Liste der Benutzer, die aus der Datenbank geladen werden
let categories = [
    "User Story",
    "Technical Task",
    "Feature",
    "Bug",
    "Documentation",
    "Design",
    "Testing QA",
    "Analyse/Research",
];


function toggleButton(prioState) {
    let button = document.getElementById(prioState);
    let img = document.getElementById(prioState + 'Img');

    // Überprüfen, ob der aktuelle Button bereits aktiv ist
    if (selectedPrio === prioState) {
        // Button deaktivieren
        button.classList.remove(`btn-${prioState}-active`);
        img.src = `../assets/img/Prio_${prioState}_color.png`;
        selectedPrio = null;  // Kein Button ist mehr ausgewählt
    } else {
        // Alle anderen Buttons deaktivieren
        let priorities = ['urgent', 'medium', 'low'];
        priorities.forEach(priority => {
            let otherButton = document.getElementById(priority);
            let otherImg = document.getElementById(priority + 'Img');
            otherButton.classList.remove(`btn-${priority}-active`);
            otherImg.src = `../assets/img/Prio_${priority}_color.png`;
        });

        // Den geklickten Button aktivieren
        button.classList.add(`btn-${prioState}-active`);
        img.src = `../assets/img/Prio_${prioState}_white.png`;
        selectedPrio = prioState;  // Speichere den aktivierten Button
    }
}

////////////Category function////////////////////////

// render categories in dropdown menu
function renderCategories() {
    let categoryContainer = document.getElementById('dropDownCategoryMenu');
    categoryContainer.innerHTML = '';
  
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      categoryContainer.innerHTML += `
        <div class="addtask-category" onclick="selectCategory('${category}')">
          ${category}
        </div>
      `;
    }
}

// wirdt gewählen eine Kategorie für die neue Aufgabe
function selectCategory(categoryTask) {
    let categoryInput = document.getElementById('categoryInput');
    let categoryList = document.getElementById('dropDownCategoryMenu');

    categoryInput.value = categoryTask;
    hideCategories();
    categoryList.style.border = "0px";
}

// open the dropdown menu
function openCategories() {
    let categoryList = document.getElementById("dropDownCategoryMenu");
    let icon = document.getElementById("categoryInput");
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
}

// close the dropdown menu
function hideCategories() {
    categoriesContainerClick = false;
    let categoryList = document.getElementById("dropDownCategoryMenu");
    let icon = document.getElementById("categoryInput");
    icon.style.transform = "rotate(0deg)";
    categoryList.innerHTML = "";
}

////////////Assigned to function////////////////////////

async function fetchContactsFromAPI() {
    try {
        let response = await fetch(BASE_URL + ".json");
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
    let icon = document.getElementById("userNameInput");
    icon.style.transform = "rotate(180deg)";
    await loadContacts(); // Lade die Kontakte
    if (!assignedContainerClick) {
        assignedContainerClick = true;
        userListElement.style.border = "1px solid #CDCDCD";
        displayDropdownUserList(userList); // userList definiert und gefüllt
    } else {
        hideUsers();
    }
}

// Funktion rendert die Liste der Benutzer im Dropdown-Menü
function displayDropdownUserList(userList) {
    let dropdownMenu = document.getElementById("dropDownUserMenu");
    dropdownMenu.innerHTML = "";
    console.log(userList);

    // Alphabetisch User sortieren
    let sortedUsers = Object.values(userList).sort((a, b) => a.username.localeCompare(b.username));

    let lastInitial = ""; // Variable zur Speicherung des letzten Buchstabens für Gruppierung

    sortedUsers.forEach((user, i) => {
        let color = user.color || generateRandomColor(); // Verwende die gespeicherte Farbe, wenn vorhanden

        let initial = user.username[0].toUpperCase();
        if (initial !== lastInitial) {
            dropdownMenu.innerHTML += `<div class="contact-list-letter"><h3>${initial}</h3></div><hr>`;
            lastInitial = initial;
        }

        dropdownMenu.innerHTML += /*html*/ `
            <div onclick="selectUser(${i})" id="contact-info${i}" class="contact">
                <div class="initials" style="background-color: ${color};">${getInitials(user.username)}</div>
                <div class="contact-info">
                    <p id="name${i}" class="name"><span>${user.username}</span></p>
                </div>
            </div>
        `;
    });
}

// Diese Funktion wird aufgerufen, wenn ein Benutzer aus dem Dropdown-Menü ausgewählt wird
function selectUser(index) {
    let user = Object.values(userList)[index]; // Greift auf den Benutzer mit dem angegebenen Index zu
    document.getElementById("userNameInput").value = user.username; // Setzt den Benutzernamen ins Input-Feld
    document.getElementById("dropDownUserMenu").innerHTML = ""; // Leert das Dropdown-Menü
}

// Funktion schließt das Benutzer-Dropdown-Menü und setzt den Zustand des Dropdown-Menüs auf geschlossen zurück
function hideUsers() {
    assignedContainerClick = false;
    let userListElement = document.getElementById("dropDownUserMenu");
    let icon = document.getElementById("userNameInput");
    icon.style.transform = "rotate(0deg)";
    userListElement.innerHTML = "";
}
