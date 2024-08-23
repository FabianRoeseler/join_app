let users = [];

async function addUser() {
  let username = document.getElementById("userName").value;
  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;
  let confirmPassword = document.getElementById("confirmUserPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }

  if (document.getElementById("acceptPp").checked != true) {
    alert("Please accept the Privacy");
    return false;
  }

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("An account with this email already exists!");
  } else {
    addUserToDb();
    alert("User registered successfully!");
  }

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("confirmUserPassword").value = "";
}

const REG_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/regUsers";

/**
 * Loading registered Userdata from DB and moves it to an local object for display
 */

// async function loadUserFromDb() {
//   let response = await fetch(REG_URL + ".json");
//   const registeredUsers = await response.json();

//   users = Object.values(registeredUsers); // Benutzerdaten in das Array speichert

//   console.log(registeredUsers);
// }

async function loadUserFromDb() {
  let response = await fetch(REG_URL + ".json");

  if (response.ok) {
    const registeredUsers = await response.json();
    users = Object.keys(registeredUsers).map(key => ({
      ...registeredUsers[key],
      id: key
    }));
    console.log('Abgerufene Benutzer:', users);
  } else {
    console.error(`Fehler beim Laden der Benutzer: HTTP-Status ${response.status}`);
  }
}

async function addUserToDb() {
  let username = document.getElementById("userName");
  let mail = document.getElementById("userEmail");
  let password = document.getElementById("userPassword");
  let data = {
    username: `${username.value}`,
    email: `${mail.value}`,
    password: `${password.value}`,
  };
  let response = await fetch(REG_URL + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function login() {
  let userEmail = document.getElementById('userEmail').value;
  let userPassword = document.getElementById('userPassword').value;

  console.log('Eingegebene E-Mail:', userEmail);
  console.log('Eingegebenes Passwort:', userPassword);
  
  // Stelle sicher, dass die Benutzerliste geladen ist
  let response = await loadUserFromDb();

  // Überprüfen, ob die Benutzer erfolgreich geladen wurden
  if (users.length > 0) {
    // Suche nach dem Benutzer im Array users
    let user = users.find(u => u.email === userEmail && u.password === userPassword);
  
    if (user) {
      console.log('Benutzer gefunden:', user);
      // Weiterleiten oder andere Aktionen
    } else {
      console.log('Benutzer nicht gefunden');
      document.getElementById('worngLogin').style.display = 'block';
    }
  } else {
    console.error('Benutzerliste konnte nicht geladen werden oder ist leer.');
  }
}
