const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

let loadedUserArray = {};
let colors = [];
let userColors = {};

/**
 * Loading data from DB and moves it to an local object for display
 */
async function loadData() {
  let response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.users) {
    loadedUserArray = data.users;
    displayContacts(loadedUserArray);
  }
}

/**
 * Sorting and displaying the contactlist
 * @param {*} users
 */
async function displayContacts(users) {
  let container = document.getElementById("contact-list");
  container.innerHTML = "";
  let sortedUsers = Object.values(users).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let lastInitial = "";
  for (let i = 0; i < sortedUsers.length; i++) {
    let user = sortedUsers[i];
    let color = user.color || generateRandomColor();
    userColors[user.username] = color;
    colors.push(color);
    container.innerHTML += renderContact(i, user, color, lastInitial);
    lastInitial = user.username[0].toUpperCase();
  }
}

/**
 * Highlighting selected contactcard
 * @param {*} contactCard
 * @param {*} i
 */
function contactCardClick(contactCard, i) {
  let nameElement = document.getElementById(`name${i}`);
  if (contactCard.classList.contains("contact-card-click")) {
    contactCard.classList.remove("contact-card-click");
    nameElement.classList.remove("contact-name");
  } else {
    closeAllContactClicks();
    contactCard.classList.add("contact-card-click");
    nameElement.classList.add("contact-name");
  }
}

/**
 * Unhighlighting non selected contactcards
 */
function closeAllContactClicks() {
  let contactCards = document.getElementsByClassName("contact");
  for (let contactCard of contactCards) {
    contactCard.classList.remove("contact-card-click");
  }
  let nameElements = document.getElementsByClassName("contact-name");
  for (let nameElement of nameElements) {
    nameElement.classList.remove("contact-name");
  }
}

/**
 * Generating a random CSS Color for the contactlist
 * @returns
 */
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Adds a new contact, generates color, saves it, user feedback, updates DB and Display
 * @param {*} path
 * @returns
 */
async function addContactS(path = "users") {
  let userNameInput = document.getElementById("addInputNameA");
  let emailInput = document.getElementById("addInputEmailB");
  let phoneInput = document.getElementById("addInputPhoneC");
  let color = generateRandomColor();
  let data = {
    username: userNameInput.value,
    email: emailInput.value,
    contactNumber: phoneInput.value,
    color: color,
  };
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  cleanInputFields();
  showSuccessPopUp();
  window.location.reload();
  return await response.json();
}

function showSuccessPopUp() {
  if (window.innerWidth < 1350) {
    document.getElementById("contact-success").style = `left: 30px;`;
  } else {
    document.getElementById("contact-success").style = `left: 64px;`;
  }
  setTimeout(closeSuccessPopUp, 1200);
}

function closeSuccessPopUp() {
  document.getElementById("contact-success").style = `left: 100%;`;
}

/**
 * Deletes the selected user from the contactlist
 * @param {*} i
 * @returns
 */
async function deleteContact(i) {
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let userId = Object.keys(loadedUserArray).find(
    (key) => loadedUserArray[key] === sortedUsers[i]
  );
  let response = await fetch(BASE_URL + "users/" + userId + ".json", {
    method: "DELETE",
  });
  await loadData();
  document.getElementById("render-contact-details").innerHTML = "";
  closeContactDetailsMobile();
  return await response.json();
}

/**
 * Cleaning the Inputfields for Add new contact form
 */
function cleanInputFields() {
  let userNameInput = document.getElementById("addInputNameA");
  let emailInput = document.getElementById("addInputEmailB");
  let phoneInput = document.getElementById("addInputPhoneC");
  if (userNameInput) userNameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
}

/**
 * HTML Rendering the Detail of a contact
 * @param {*} i
 */
function renderContactDetails(i) {
  let contactDetail = document.getElementById("render-contact-details");
  let contactDetailsMobile = document.getElementById(
    "render-contact-details-mobile"
  );
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  let user = sortedUsers[i];
  let color = userColors[user.username] || user.color || generateRandomColor();
  userColors[user.username] = color;

  let isMobile = window.innerWidth < 1192;
  let htmlContent = generateContactDetailsHTML(i, user, color, isMobile);

  if (isMobile) {
    contactDetailsMobile.innerHTML = htmlContent;
    document
      .getElementById("contact-details-mobile")
      .classList.remove("d-none");
    document.getElementById("details-mobile-add-btn").classList.add("d-none");
  } else {
    contactDetail.innerHTML = htmlContent;
    contactDetail.style = `width: 100%; left: 0;`;
    document.getElementById(
      "initials-detail"
    ).style.background = `${colors[i]}`;
  }
}

/**
 * Getting the first character from the names
 * @param {*} name
 * @returns
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

/**
 * Saving changes after a contact is edited from indexed user and handles the color
 * @returns
 */
async function saveContact() {
  let editNameInput = document.getElementById("editInputName");
  let editEmailInput = document.getElementById("editInputEmail");
  let editPhoneInput = document.getElementById("editInputPhone");
  let updatedData = {
    username: editNameInput.value,
    email: editEmailInput.value,
    contactNumber: editPhoneInput.value,
  };
  let userIndex = window.currentlyEditingUserIndex;
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  if (userIndex < 0 || userIndex >= sortedUsers.length) {
    return;
  }
  let userId = Object.keys(loadedUserArray).find(
    (key) => loadedUserArray[key] === sortedUsers[userIndex]
  );
  let color =
    userColors[sortedUsers[userIndex].username] || generateRandomColor();
  userColors[updatedData.username] = color;
  updatedData.color = color;
  let response = await fetch(BASE_URL + "users/" + userId + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  closeEditContactPopup();
  closeContactDetailsMobile();
  document.getElementById("render-contact-details").innerHTML = "";
  await loadData();
  displayContacts(loadedUserArray);
}

/**
 * Rendering the contactedit popup
 * @param {*} i
 */
function renderEdit(i) {
  window.currentlyEditingUserIndex = i;
  let sortedUsers = Object.values(loadedUserArray).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  if (i >= 0 && i < sortedUsers.length) {
    let user = sortedUsers[i];
    let editContainer = document.getElementById("editContact");
    editContainer.innerHTML = "";
    editContainer.innerHTML = generateEditContactHTML(user, i);
  }
}

function closeContactDetailsMobile() {
  document.getElementById("contact-details-mobile").classList.add("d-none");
  document.getElementById("details-mobile-add-btn").classList.remove("d-none");
}

function openMobileEditMenu() {
  document.getElementById(
    "details-mobile-round-btn"
  ).style = `background-color: var(--darkLightBlue)`;
  document.getElementById(
    "mobile-edit-menu"
  ).style = `right: 12px; width: 116px`;
}

function closeMobileEditMenu() {
  document.getElementById("mobile-edit-menu").style = `right: 0; width: 0`;
  document.getElementById("details-mobile-round-btn").style = `background-color: var(--darkGray)`;
}

function stop(event) {
  event.stopPropagation();
}

/**
 * Clears the Errorfields on contact forms
 */
function clearValidateFields() {
  let xName = document.getElementById("validSpanFieldName");
  let xEmail = document.getElementById("validSpanFieldEmail");
  let xPhone = document.getElementById("validSpanFieldPhone");
  xName.innerHTML = "";
  xEmail.innerHTML = "";
  xPhone.innerHTML = "";
}

/**
 * Clears the Errorfields on contact forms
 */
function clearEditFields() {
  let yName = document.getElementById("editValidSpanFieldName");
  let yEmail = document.getElementById("editValidSpanFieldEmail");
  let yPhone = document.getElementById("editValidSpanFieldPhone");
  yName.innerHTML = "";
  yEmail.innerHTML = "";
  yPhone.innerHTML = "";
}

/**
 * Checking regex for the name and points to the email if correct
 * @returns
 */
function validateName() {
  let x = document.forms["addContactForm"]["addName"].value;
  let xName = document.getElementById("validSpanFieldName");
  if (x == "") {
    xName.innerHTML = "Please fill your name";
    return false;
  } else {
    return validateEmail();
  }
}

/**
 * Checking regex for the email and points to the phonenumber
 * @returns
 */
function validateEmail() {
  let x = document.forms["addContactForm"]["addEmail"].value;
  let xEmail = document.getElementById("validSpanFieldEmail");
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (x == "") {
    xEmail.innerHTML = "Please fill your email";
    return false;
  } else if (!emailPattern.test(x)) {
    xEmail.innerHTML = "Please enter a valid email address";
    return false;
  } else {
    return validatePhone();
  }
}

/**
 * checking regex for the phone and if correct adds the new contact
 * @returns
 */
function validatePhone() {
  let x = document.forms["addContactForm"]["addPhone"].value;
  let xPhone = document.getElementById("validSpanFieldPhone");
  if (x == "") {
    xPhone.innerHTML = "Please fill your phone";
    return false;
  } else {
    addContactS();
    closeContactPopup();
    setTimeout(() => {
      loadData();
    }, 500);
    return false;
  }
}

/**
 * Checking regex for the name and points to the email if correct
 * @returns
 */
function editValidateName() {
  let x = document.forms["editForm"]["editName"].value;
  let xName = document.getElementById("editValidSpanFieldName");
  if (x == "") {
    xName.innerHTML = "Please fill your name";
    return false;
  } else {
    return editValidateEmail();
  }
}

/**
 * Checking regex for the email and points to the phone if correct
 * @returns
 */
function editValidateEmail() {
  let x = document.forms["editForm"]["editEmail"].value;
  let xEmail = document.getElementById("editValidSpanFieldEmail");
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (x == "") {
    xEmail.innerHTML = "Please fill your email";
    return false;
  } else if (!emailPattern.test(x)) {
    xEmail.innerHTML = "Please enter a valid email address";
    return false;
  } else {
    return editValidatePhone();
  }
}

/**
 * Checking regex for the phone and saves the contact if correct
 * @returns
 */
function editValidatePhone() {
  let x = document.forms["editForm"]["editPhone"].value;
  let xPhone = document.getElementById("editValidSpanFieldPhone");
  if (x == "") {
    xPhone.innerHTML = "Please fill your phone";
    return false;
  } else {
    saveContact();
    return false;
  }
}
