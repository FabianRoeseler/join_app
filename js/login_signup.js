let users = [];
const REG_URL =
  "INSERT FIREBASE REALTIME DATABASE URL HERE/regUsers";

/**
 * Adding a user to the Database incl. popup, timing, form reset etc.
 */
async function addUser() {
  let email = document.getElementById("userEmail").value;

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("An account with this email already exists!");
  } else {
    const signupSuccessElement = document.getElementById("userCreatedSuccess");
    signupSuccessElement.classList.remove("d-none");
    setTimeout(showCreatedUserSuccessPopUp, 100);
    addUserToDb();
    setTimeout(function () {
      window.location.href = "../html/index.html";
    }, 1500);
  }

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("confirmUserPassword").value = "";
}

/**
 * Loading registered Userdata from DB and moves it to an local object for display
 */
async function loadUserFromDb() {
  let response = await fetch(REG_URL + ".json");

  if (response.ok) {
    const registeredUsers = await response.json();
    const users = Object.keys(registeredUsers).map((key) => ({
      ...registeredUsers[key],
      id: key,
    }));
    return users;
  } else {
    return [];
  }
}

/**
 * New user to DB push
 * @returns
 */
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

/**
 * Login function, checking and setting localstorage if checked. Checking data, popup animation
 * and linking to the summary after login.
 */
async function login() {
  let userEmail = document.getElementById("enterUserEmail").value;
  let userPassword = document.getElementById("enterUserPassword").value;
  let wrongCredentials = document.getElementById("loginPasswordInputError");

  let users = await loadUserFromDb();
  if (users && users.length > 0) {
    let user = users.find(
      (u) => u.email === userEmail && u.password === userPassword
    );

    if (user) {
      saveLoginData();
      const loginSuccessElement = document.getElementById("loginSuccess");
      loginSuccessElement.classList.remove("d-none");
      setTimeout(loginSuccessfullPopUp, 100);
      saveUsernameLocal(user.username);
      users = [];
      setTimeout(function () {
        window.location.href = "../html/summary.html";
      }, 1500);
    } else {
      wrongCredentials.innerHTML = "Your Email or Password doesn't exist.";
    }
  }
}

/**
 * Localstorage username for greeting in summary
 * @param {*} username
 */
function saveUsernameLocal(username) {
  localStorage.setItem("username", username);
}

/**
 * Formvalidation for Signup until adding a new user to DB
 * @returns
 */
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
  if (x == "" || x != document.getElementById("userPassword").value) {
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

/**
 * Popups for creating a new user and logging in
 */
function showCreatedUserSuccessPopUp() {
  if (window.innerWidth < 1350) {
    document.getElementById("userCreatedSuccess").style = `left: 1%;`;
  } else {
    document.getElementById("userCreatedSuccess").style = `left: 1%;`;
  }
}

function loginSuccessfullPopUp() {
  const loginSuccessElement = document.getElementById("loginSuccess");
  loginSuccessElement.classList.remove("d-none");
  if (window.innerWidth < 1350) {
    loginSuccessElement.style.left = "1%";
  } else {
    loginSuccessElement.style.left = "1%";
  }
}

/**
 * Formvalidation for login
 * @returns
 */
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

/**
 * Remember me checkbox saving data to localstorage
 */
function saveLoginData() {
  const email = document.getElementById("enterUserEmail").value;
  const password = document.getElementById("enterUserPassword").value;
  const rememberMe = document.getElementById("rememberMeCheckbox").checked;

  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
    localStorage.setItem("rememberedPassword", password);
    localStorage.setItem("rememberMeChecked", rememberMe);
  } else {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    localStorage.removeItem("rememberMeChecked");
  }
}

/**
 * Checking localstorage for saved logindata
 */
function checkRememberedLoginData() {
  const savedEmail = localStorage.getItem("rememberedEmail");
  const savedPassword = localStorage.getItem("rememberedPassword");
  const rememberMeChecked = localStorage.getItem("rememberMeChecked");

  if (savedEmail && savedPassword && rememberMeChecked) {
    document.getElementById("enterUserEmail").value = savedEmail;
    document.getElementById("enterUserPassword").value = savedPassword;
    document.getElementById("rememberMeCheckbox").checked = true;
  }
}
