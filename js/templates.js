async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function openDropdown() {
  // if (window.innerWidth < 830) {
  //     document.getElementById('dropdown').classList.add('dropdown-style-mobile');
  //     document.getElementById('dropdown').classList.toggle('toggle-style-dropdown');
  // } else {
  document.getElementById("dropdown").classList.toggle("d-none");
  // }
}

function renderContact(i, user, color, lastInitial) {
  let initial = user.username[0].toUpperCase();
  let contactHTML = "";

  if (initial !== lastInitial) {
    contactHTML += `<div class="contact-list-letter"><h3>${initial}</h3></div><hr>`;
  }

  contactHTML += /*html*/ `
    <div onclick="renderContactDetails(${i}), contactCardClick(this, ${i})" id="contact-info${i}" class="contact">
      <div class="initials" style="background-color: ${color};">${getInitials(
    user.username
  )}</div>
      <div class="contact-info">
        <p id="name${i}" class="name"><span>${user.username}</span></p>
        <p class="email">${user.email}</p>
      </div>
    </div>
  `;

  return contactHTML;
}

// renderContactDetails.js

function generateContactDetailsHTML(i, user, color, isMobile) {
  if (isMobile) {
    return /*html*/ `
      <div class="render-details-head-mobile">
        <div id="initials-detail" class="profile-initials-mobile">${getInitials(
          user.username
        )}</div>
        <div class="profile-name-mobile">${user.username}</div>
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
        <img src="../assets/img/kebab-menu.svg" alt="more options">
      </div>
      <div id="mobile-edit-menu">
        <div class="edit-delete-child-mobile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- SVG content for edit -->
          </svg>
          <span onclick="openEditContact(); renderEdit(${i})">Edit</span>
        </div>
        <div onclick="deleteContact(${i})" class="edit-delete-child-mobile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- SVG content for delete -->
          </svg>
          <span>Delete</span>
        </div>
      </div>
    `;
  } else {
    return /*html*/ `
      <div class="render-details-head">
        <div id="initials-detail" class="profile-initials" style="background-color: ${color};">
          ${getInitials(user.username)}
        </div>
        <div>
          <div class="profile-name">${user.username}</div>
          <div class="edit-delete-cont">
            <div class="edit-delete-child">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- SVG content for edit -->
              </svg>
              <span onclick="openEditContact(); renderEdit(${i})">Edit</span>
            </div>
            <div onclick="deleteContact(${i})" class="edit-delete-child">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- SVG content for delete -->
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
  }
}

function generateEditContactHTML(user, index) {
  return /*html*/ `
    <div class="edit-contact-top-left-section">
      <img class="edit-contact-logo" src="../assets/img/join_logo_white.png" alt="">
      <h1 class="edit-contact-headline">Edit contact</h1>
      <div class="edit-contact-separator"></div>
    </div>
    <div class="edit-contact-bottom-right-section">
      <span class="edit-contact-avatar"></span>
      <div class="edit-contact-bottom-rightmost-section">
        <div type="reset" onclick="closeEditContactPopup()" id="contactCloseButton" class="edit-contact-close"></div>
        <form onsubmit="editValidateName(); return false" class="edit-contact-form" name="editForm">
          <div class="input-edit-container">
            <input onkeyup="clearEditFields()" name="editName" class="edit-imput edit-imput-name" id="editInputName" type="text" placeholder="Name" value="${user.username}"><br> 
            <span class="validSpanField" id="editValidSpanFieldName"></span>
          </div>
          <div class="input-edit-container">
            <input onkeyup="clearEditFields()" name="editEmail" class="edit-imput edit-imput-email" id="editInputEmail" type="text" placeholder="Email" value="${user.email}"><br> 
            <span class="validSpanField" id="editValidSpanFieldEmail"></span>
          </div>
          <div class="input-edit-container">
            <input onkeyup="clearEditFields()" name="editPhone" class="edit-imput edit-imput-phone" id="editInputPhone" type="number" placeholder="Phone" value="${user.contactNumber}"><br> 
            <span class="validSpanField" id="editValidSpanFieldPhone"></span>
          </div>
          <div class="button-edit-container">
            <button onclick="deleteContact(${index})" class="btn-cancel">
              Delete
            </button>
            <button type="submit" class="btn-create btn-create:hover ::root">Save<img src="../assets/img/check.svg"></button>
          </div>
        </form>
      </div>
    </div>
  `;
}
