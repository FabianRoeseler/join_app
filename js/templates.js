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

function generateToDoHTML(element, i) {
  return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${index_to_do[i]})" class="task">
            <div class="task-head">
                <div class="task-category" style="background : ${element.category[1]}">${element.category[0]}</div>
                <img onclick="toggleKebabDropdown(${index_to_do[i]})" src="../assets/img/kebab.svg" alt="more options">
                <div id="kebab-dropdown${index_to_do[i]}" class="kebab-dropdown d-none">
                    <span onclick="moveToInProgress(${index_to_do[i]})">In progress</span>
                    <span onclick="moveToAwaitFeedback(${index_to_do[i]})">Await feedback</span>
                    <span onclick="moveToDone(${index_to_do[i]})">Done</span>
                </div>
            
            </div>
            <span id="task-title">${element.title}</span>
            <span id="task-description">${element.description}</span>
            <div class="subtasks">
                <div id="subtask-progress">
                    <div id="progress-bar" style="width:${
                      (100 / element.subtasks.length) *
                      element.subtasks_done.length
                    }%"></div>
                </div>
                <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
            </div>
            <div class="assigned-prio-cont">
                <div id="assigned-initials">
                    <div class="test-initials">${element.assigned_to[0]}</div>
                    <div class="test-initials bg-green">${
                      element.assigned_to[1]
                    }</div>
                    <div class="test-initials bg-violet">${
                      element.assigned_to[2]
                    }</div>
                </div>
                <div id="task-prio">
                    <img class="prio-icons" src="${
                      element.prio_img
                    }" alt="prio icon">
                </div>
            </div>
        </div>
    `;
}

function generateInProgressHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_in_progress[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_in_progress[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_in_progress[i]
                  }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_in_progress[i]})">To do</span>
                        <span onclick="moveToAwaitFeedback(${
                          index_in_progress[i]
                        })">Await feedback</span>
                        <span onclick="moveToDone(${
                          index_in_progress[i]
                        })">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}

function generateAwaitFeedbackHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_await_feedback[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_await_feedback[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_await_feedback[i]
                  }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_await_feedback[i]})">To do</span>
                        <span onclick="moveToInProgress(${
                          index_await_feedback[i]
                        })">In progress</span>
                        <span onclick="moveToDone(${
                          index_await_feedback[i]
                        })">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}

function generateDoneHTML(element, i) {
  return /*html*/ `
          <div draggable="true" ondragstart="startDragging(${
            index_done[i]
          })" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${
                    element.category[1]
                  }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${
                    index_done[i]
                  })" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${
                    index_done[i]
                  }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_done[i]})">To do</span>
                        <span onclick="moveToInProgress(${
                          index_done[i]
                        })">In progress</span>
                        <span onclick="moveToAwaitFeedback(${
                          index_done[i]
                        })">Await feedback</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description">${element.description}</span>
              <div class="subtasks">
                  <div id="subtask-progress">
                      <div id="progress-bar" style="width:${
                        (100 / element.subtasks.length) *
                        element.subtasks_done.length
                      }%"></div>
                  </div>
                  <div id="subtask-counter">${element.subtasks_done.length}/${
    element.subtasks.length
  } Subtasks</div>
              </div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials">
                      <div class="test-initials">${element.assigned_to[0]}</div>
                      <div class="test-initials bg-green">${
                        element.assigned_to[1]
                      }</div>
                      <div class="test-initials bg-violet">${
                        element.assigned_to[2]
                      }</div>
                  </div>
                  <div id="task-prio">
                      <img class="prio-icons" src="${
                        element.prio_img
                      }" alt="prio icon">
                  </div>
              </div>
          </div>
      `;
}
