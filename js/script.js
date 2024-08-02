let colors = [];

const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

let loadedUserArray = {};
let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let userNameInput = document.getElementById("inputName"); // userName
let emailInput = document.getElementById("inputEmail"); // email
let phoneInput = document.getElementById("inputPhone"); // phonenumber

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

  let userKeys = Object.keys(users); // Changes DB Data to an Object
  // console.log("User Keys:", userKeys); // remove later

  let lastInitial = ''; // Variable zur Speicherung des letzten Buchstabens für Gruppierung

  for (let i = 1; i < userKeys.length; i++) {
    // Iterates through the DB Data delivered
    // let userKey = userKeys[i]; // Iterates data
    // let user = users[userKey]; // variable to use iterates Data
    let user = users[`user${i}`];

    // generates a randow colorcode and pushes it to "colors" array
    let color = generateRandomColor();
    colors.push(color);

    // generates extra headline with first Letter of contact name
    let initial = user.username[0].toUpperCase(); // Holt den ersten Buchstaben des Namens und macht ihn groß
    if (initial !== lastInitial) {
        // Wenn das Initial anders ist als das letzte, füge eine neue Buchstabenüberschrift hinzu
        container.innerHTML += `<h3>${initial}</h3><hr>`;
        lastInitial = initial; // Aktualisiert das letzte Initial
    }

    container.innerHTML += /*html*/`
      <div onclick="renderContactDetails(${i})" class="contact">
        <div class="initials" style="background-color: ${color};">${getInitials(user.username)}</div>
          <div class="contact-info">
            <p class="name"><span>${user.username}</span></p>
            <p class="email">${user.email}</p>
          </div>
        </div>
    `;
  }
}

async function addContact(
  path = "users",
  data = {
    firstName: `${firstNameInput.value}`,
    lastName: `${lastNameInput.value}`,
    username: `${userNameInput.value}`,
    email: `${emailInput.value}`,
    contactNumber: `${phoneInput.value}`,
    avatarUrl: "asbachuralt.com",
    assignedTasks: { taskName: "Adding Data" },
  }
) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  cleanInputFields();
  window.location.reload();
  return (responseToJson = await response.json());
}

async function deleteContact(i) {
  let response = await fetch(
    BASE_URL + "users" + "/" + Object.keys(loadedUserArray)[i] + ".json",
    {
      method: "DELETE",
    }
  );
  window.location.reload();
  return (responseToJson = await response.json());
}

function cleanInputFields() {
  firstNameInput.value = "";
  lastNameInput.value = "";
  userNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  firstNameInput.value = "";
}
