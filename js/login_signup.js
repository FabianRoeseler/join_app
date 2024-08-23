let users = [];

async function addUser() {
  let email = document.getElementById("userEmail").value;

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("An account with this email already exists!");
  } else {
    addUserToDb();
    showCreatedUserSuccessPopUp();
    setTimeout(function () {
      window.location.href = "../html/index.html";
    }, 1500);
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
    users = Object.keys(registeredUsers).map((key) => ({
      ...registeredUsers[key],
      id: key,
    }));
    console.log("Abgerufene Benutzer:", users);
  } else {
    console.error(
      `Fehler beim Laden der Benutzer: HTTP-Status ${response.status}`
    );
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
  let userEmail = document.getElementById("enterUserEmail").value;
  let userPassword = document.getElementById("enterUserPassword").value;
  // Stelle sicher, dass die Benutzerliste geladen ist
  let response = await loadUserFromDb();
  // Überprüfen, ob die Benutzer erfolgreich geladen wurden
  if (response && response.length > 0) {
    let users = response; // Benutzerliste aus der response extrahieren
    // Suche nach dem Benutzer im Array users
    let user = users.find(
      (u) => u.email === userEmail && u.password === userPassword
    );
  }
}

function validateNameInput() {
  let x = document.getElementById("userName").value;
  let xName = document.getElementById("addNameError");
  if (x == "") {
    xName.innerHTML = "Please enter your Name";
    return false;
  } else {
    xName.innerHTML = "";
    return validateEmailInput();
  }
}

function validateEmailInput() {
  let x = document.getElementById("userEmail").value;
  let xName = document.getElementById("addEmailError");
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (x == "") {
    xName.innerHTML = "Please enter your Email";
    return false;
  } else if (!emailRegex.test(x)) {
    xName.innerHTML = "Please enter a valid Email address";
    return false;
  } else {
    xName.innerHTML = "";
    return validatePasswordInput();
  }
}

function validatePasswordInput() {
  let x = document.getElementById("userPassword").value;
  let xName = document.getElementById("addPasswordError");
  if (x == "") {
    xName.innerHTML = "Please enter a Password";
    return false;
  } else {
    xName.innerHTML = "";
    return validateConfirmPasswordInput();
  }
}

function validateConfirmPasswordInput() {
  let x = document.getElementById("confirmUserPassword").value;
  let xName = document.getElementById("addConfirmPasswordError");
  if (x == "") {
    xName.innerHTML = "Please confirm your Password";
    return false;
  } else {
    xName.innerHTML = "";
    return validatePrivacyInput();
  }
}

function validatePrivacyInput() {
  let x = document.getElementById("acceptPp").checked;
  let xName = document.getElementById("addPrivacyError");
  if (x != true) {
    xName.innerHTML = "Please accept our Privacy Policy";
  } else {
    xName.innerHTML = "";
    return addUser();
  }
}

function showCreatedUserSuccessPopUp() {
  if (window.innerWidth < 1350) {
    document.getElementById("userCreatedSuccess").style = `left: 60%;`;
  } else {
    document.getElementById("userCreatedSuccess").style = `left: 60%;`;
  }
}

function validateLoginEmailInput() {
  let x = document.getElementById("enterUserEmail").value;
  let xName = document.getElementById("loginEmailInputError");
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (x == "") {
    xName.innerHTML = "Please enter your Email";
    return false;
  } else if (!emailRegex.test(x)) {
    xName.innerHTML = "Please enter a valid Email address";
    return false;
  } else {
    xName.innerHTML = "";
    return validateLoginPasswordInput();
  }
}

function validateLoginPasswordInput() {
  let x = document.getElementById("enterUserPassword").value;
  let xName = document.getElementById("loginPasswordInputError");
  if (x == "") {
    xName.innerHTML = "Please enter your Password";
    return false;
  } else {
    xName.innerHTML = "";
    return login();
  }
}
