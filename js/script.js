let colors = [];

const BASE_URL = "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

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

  let sortedUsers = Object.values(users).sort((a, b) => a.username.localeCompare(b.username));

  let lastInitial = ''; // Variable zur Speicherung des letzten Buchstabens für Gruppierung

  for (let i = 0; i < sortedUsers.length; i++) {
    let user = sortedUsers[i];

    let color = generateRandomColor();
    colors.push(color);

    let initial = user.username[0].toUpperCase(); 
    if (initial !== lastInitial) {
      container.innerHTML += `<h3>${initial}</h3><hr>`;
      lastInitial = initial;
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

function alphabet() {
  loadedUserArray = Object.values(loadedUserArray);
  loadedUserArray.sort((a, b) => a.username.localeCompare(b.username));
  let container = document.getElementById("contact-list");
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

async function addContactS(
  path = "users"
) {
  let userNameInput = document.getElementById("addInputNameA");
  let emailInput = document.getElementById("addInputEmailB");
  let phoneInput = document.getElementById("addInputPhoneC");

  if (!userNameInput || !emailInput || !phoneInput) {
    console.error("One or more input elements are missing.");
    return;
  }

  let data = {
    firstName: `firstName`,
    lastName: `lastName`,
    username: userNameInput.value,
    email: emailInput.value,
    contactNumber: phoneInput.value,
    avatarUrl: "asbachuralt.com",
    assignedTasks: { taskName: "Adding Data" },
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
  let response = await fetch(
    BASE_URL + "users" + "/" + Object.keys(loadedUserArray)[i] + ".json",
    {
      method: "DELETE",
    }
  );
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
