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

function stop(event) {
  event.stopPropagation();
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
                    <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_207322_3882)">
                        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                    </g>
                </svg>          
                <span onclick="openEditContact(); renderEdit(${i})">Edit</span>
        </div>
        <div onclick="deleteContact(${i})" class="edit-delete-child-mobile">
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
        <div id="task${i}" draggable="true" ondragstart="startDragging(${index_to_do[i]}, ${i})" onclick="openTaskDetails(${index_to_do[i]})" class="task">
            <div class="task-head">
                <div class="task-category" style="background : ${element.category[1]}">${element.category[0]}</div>
                <img onclick="toggleKebabDropdown(${index_to_do[i]}), stop(event)" src="../assets/img/kebab.svg" alt="more options">
                <div id="kebab-dropdown${index_to_do[i]}" class="kebab-dropdown d-none">
                    <span onclick="moveToInProgress(${index_to_do[i]}, stop(event))">In progress</span>
                    <span onclick="moveToAwaitFeedback(${index_to_do[i]}, stop(event))">Await feedback</span>
                    <span onclick="moveToDone(${index_to_do[i]}, stop(event))">Done</span>
                </div>
            
            </div>
            <span id="task-title">${element.title}</span>
            <span id="task-description-to-do${i}" class="task-description"></span>
            <div id="subtasks-progess-to-do${i}" class="subtasks"></div>
            <div class="assigned-prio-cont">
                <div id="assigned-initials-to-do${i}" class="initials-small-task">
                </div>
                <div id="task-prio-to-do${i}"></div>
            </div>
        </div>
    `;

}

function generateInProgressHTML(element, i) {
  return /*html*/ `
          <div id="task${i}" draggable="true" ondragstart="startDragging(${index_in_progress[i]
    })" onclick="openTaskDetails(${index_in_progress[i]})" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${element.category[1]
    }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${index_in_progress[i]
    }, stop(event))" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${index_in_progress[i]
    }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_in_progress[i]}), stop(event)">To do</span>
                        <span onclick="moveToAwaitFeedback(${index_in_progress[i]
    }), stop(event)">Await feedback</span>
                        <span onclick="moveToDone(${index_in_progress[i]
    }), stop(event)">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description-in-progress${i}" class="task-description"></span>
              <div id="subtasks-progess-in-progress${i}" class="subtasks"></div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials-in-progress${i}" class="initials-small-task">
                  </div>
                  <div id="task-prio-in-progress${i}"></div>
              </div>
          </div>
      `;
}

function generateAwaitFeedbackHTML(element, i) {
  return /*html*/ `
          <div id="task${i}" draggable="true" ondragstart="startDragging(${index_await_feedback[i]
    })" onclick="openTaskDetails(${index_await_feedback[i]})" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${element.category[1]
    }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${index_await_feedback[i]
    }, stop(event))" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${index_await_feedback[i]
    }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_await_feedback[i]}), stop(event)">To do</span>
                        <span onclick="moveToInProgress(${index_await_feedback[i]
    }), stop(event)">In progress</span>
                        <span onclick="moveToDone(${index_await_feedback[i]
    }), stop(event)">Done</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description-await-feedback${i}" class="task-description"></span>
              <div id="subtasks-progess-await-feedback${i}" class="subtasks"></div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials-await-feedback${i}" class="initials-small-task">
                  </div>
                  <div id="task-prio-await-feedback${i}"></div>
              </div>
          </div>
      `;
}

function generateDoneHTML(element, i) {
  return /*html*/ `
          <div id="task${i}" draggable="true" ondragstart="startDragging(${index_done[i]
    })" onclick="openTaskDetails(${index_done[i]})" class="task">
              <div class="task-head">
                  <div class="task-category" style="background : ${element.category[1]
    }">${element.category[0]}</div>
                  <img onclick="toggleKebabDropdown(${index_done[i]
    }, stop(event))" src="../assets/img/kebab.svg" alt="more options">
                  <div id="kebab-dropdown${index_done[i]
    }" class="kebab-dropdown d-none">
                        <span onclick="moveToToDo(${index_done[i]}), stop(event)">To do</span>
                        <span onclick="moveToInProgress(${index_done[i]
    }), stop(event)">In progress</span>
                        <span onclick="moveToAwaitFeedback(${index_done[i]
    }), stop(event)">Await feedback</span>
                  </div>
              
              </div>
              <span id="task-title">${element.title}</span>
              <span id="task-description-done${i}" class="task-description"></span>
              <div id="subtasks-progess-done${i}" class="subtasks"></div>
              <div class="assigned-prio-cont">
                  <div id="assigned-initials-done${i}" class="initials-small-task">
                  </div>
                  <div id="task-prio-done${i}"></div>
              </div>
          </div>
      `;
}

function generateTaskDetailsHTML(task, i) {
  return /*html*/ `
    <div id="task-details-view-${i}">
      <div class="task-details">
        <div class="task-details-main-part">
          <div class="task-head">
              <div class="task-category-detail" style="background : ${task.category[1]}">${task.category[0]}</div>
              <img onclick="closeTaskDetails()" src="../assets/img/iconoir_cancel.svg" alt="close">
          </div>
          <span class="task-details-title">${task.title}</span>
          <span id="task-details-description${i}" class="task-details-description"></span>
          <div class="task-details-date-style">
              <span class="task-subtitles">Due date:</span>
              <span>${task.due_date}</span>
          </div>
          <div id="task-details-prio${i}" class="task-details-prio-style">
              <span class="task-subtitles">Priority:</span>
              <div class="prio-cont${i}"></div>
          </div>
          <div id="assigned-users-cont${i}" class="assigned-to">
              <span class="task-subtitles">Assigned To:</span>
              <div id="assigned-contacts"></div>
          </div>
          <div id="subtasks-cont${i}" class="subtasks-popup">
              <span class="task-subtitles">Subtasks</span>
              <div id="subtasks-details${i}"></div>
          </div>
        </div>
        <div class="delete-edit-cont">
          <div onclick="deleteTask(${i})" class="delete-edit-single">
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
          <div class="separator-line"></div>
          <div onclick="openEdit(${i})" class="delete-edit-single">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_207322_3882)">
                <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
              </g>
            </svg>    
            <span>Edit</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateTaskEditSalmai() {
  return /*html*/`
        <div id="task-edit-view-${i}" style="display: none;">
      <div class="task-details">
        <div class="task-details-main-part">
          <div class="task-head">
              <div class="task-category-detail" style="background : ${task.category[1]}">${task.category[0]}</div>
              <img onclick="closeTaskDetails()" src="../assets/img/iconoir_cancel.svg" alt="close">
          </div>
          <input type="text" id="editTaskTitle-${i}" value="${task.title}" class="input-addtask" placeholder="Enter a title...">
          <textarea id="editDescription-${i}" class="task-details-description">${task.description}</textarea>
          <div class="task-details-date-style">
              <span class="task-subtitles">Due date:</span>
              <input type="date" id="editDueDate-${i}" value="${task.due_date}" class="input-addtask" placeholder="Select a due date">
          </div>
          <div class="task-details-prio-style">
              <span class="task-subtitles">Priority:</span>
              <div class="prio-btn-content">
    <button id="urgent" class="prio-button ${task.prio === 'urgent' ? 'btn-urgent-active' : ''}" onclick="toggleButton('urgent')" type="button">
        Urgent
        <img id="urgentImg" src="../assets/img/Prio_urgent_${task.prio === 'urgent' ? 'white' : 'color'}.png" alt="Urgent Icon" />
    </button>
    <button id="medium" class="prio-button ${task.prio === 'medium' ? 'btn-medium-active' : ''}" onclick="toggleButton('medium')" type="button">
        Medium
        <img id="mediumImg" src="../assets/img/Prio_medium_${task.prio === 'medium' ? 'white' : 'color'}.png" alt="Medium Icon" />
    </button>
    <button id="low" class="prio-button ${task.prio === 'low' ? 'btn-low-active' : ''}" onclick="toggleButton('low')" type="button">
        Low
        <img id="lowImg" src="../assets/img/Prio_low_${task.prio === 'low' ? 'white' : 'color'}.png" alt="Low Icon" />
    </button>
</div>
          </div>
          <div class="field-text-flex" id="addTaskAssignedTo">
    <label>Assigned to</label>
    <input
        class="input-addtask"
        onclick="showUsers()"
        id="userNameInput"
        type="text"
        placeholder="Select contact to assign"
        maxlength="40"
    />
    <img
        onclick="showUsers()"
        id="arrowDropMenuAssigned"
        src="../assets/img/arrow_drop_down.png"
        alt=""
    />
    <div id="dropDownUserMenu"></div>
    <div id="contentAssignedUsers">
        ${task.assigned_users.map(user => `
            <div class="assigned-user">
                <div class="initials" style="background-color: ${user.color};">
                    ${getInitials(user.username)}
                </div>
                <!-- Das unerwünschte Symbol wurde entfernt -->
            </div>
        `).join('')}
    </div>
</div>

<div class="subtasks-popup">
    <span class="task-subtitles">Subtasks</span>
    <div class="subtask-input-wrapper">
      <input id="subtaskInput" class="input-addtask" type="text" placeholder="Add new subtask">
      <div class="input-icons">
        <button onclick="addSubtask()">+</button>
      </div>
    </div>
    <ul id="subtasksContent">
        ${task.subtasks && task.subtasks.length > 0
      ? task.subtasks.map((subtask, index) => `
                <li id="subtask-${index}" class="subtask-item">
                    <div class="dot"></div>
                    <div class="subtask-text">
                        <span id="span-${index}" onclick="editSubtask('subtask-${index}', 'span-${index}', 'input-${index}')">${subtask.subtask}</span>
                    </div>
                    <div class="subtask-icon">
                        <img onclick="editSubtask('subtask-${index}', 'span-${index}', 'input-${index}')" src="../assets/img/edit.svg" alt="edit">
                        <div class="divider"></div>
                        <img onclick="deleteSubtask('subtask-${index}')" src="../assets/img/delete.svg" alt="delete">
                    </div>
                </li>`).join('')
      : "No subtasks available"}
    </ul>
</div>

          <div class="save-cancel-cont">
              <button onclick="saveEditedTask(${i})">Save</button>
              <button onclick="toggleEditView(${i})">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

//toggle
function toggleEditView(i) {
  let detailView = document.getElementById(`task-details-view-${i}`);
  let editView = document.getElementById(`task-edit-view-${i}`);

  if (detailView.style.display !== "none") {
    detailView.style.display = "none";
    editView.style.display = "block";
  } else {
    detailView.style.display = "block";
    editView.style.display = "none";
  }
}

function generateTaskDetailsEditHTML(i) {
  return /*html*/`
      <div class="edit-cancel-cont">
        <img onclick="closeEdit(${i})" src="../assets/img/iconoir_cancel.svg" class="edit-cancel" alt="close">
      </div>
      <div class="task-details-edit overflow-hidden">
        <form>
            <div class="addtask-form-left-top">
              <div class="field-text-flex">
                <label>
                  Title
                  <span style="color: #ff8190">*</span>
                </label>
                <input
                  class="input-addtask"
                  id="editTitle"
                  type="text"
                  placeholder="Enter a title"
                  maxlength="40"
                />
              </div>

              <div class="field-text-flex" id="addTaskDiscription">
                <label>Description</label>
                <textarea
                  id="editDescription"
                  placeholder="Enter a Descriptio"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>

              <div class="field-text-flex" id="addTaskDueDate">
                <label>
                  Due date
                  <span style="color: #ff8190">*</span>
                </label>
                <input
                  class="input-addtask"
                  id="editDueDate"
                  type="date"
                  min="2024-08-08"
                />
                <span id="addDateError" class="validSpanDate"></span>
              </div>

              <div class="prio-content field-text-flex">
                <label>Prio</label>
                <div class="prio-btn-content">
                  <button
                    id="urgent"
                    class="prio-button"
                    onclick="toggleButton('urgent')"
                    type="button"
                  >
                    Urgent
                    <img
                      id="urgentImg"
                      src="../assets/img/Prio_urgent_color.png"
                      alt=""
                    />
                  </button>
                  <button
                    id="medium"
                    class="prio-button"
                    onclick="toggleButton('medium')"
                    type="button"
                  >
                    Medium
                    <img
                      id="mediumImg"
                      src="../assets/img/Prio_medium_color.png"
                      alt=""
                    />
                  </button>
                  <button
                    id="low"
                    class="prio-button"
                    onclick="toggleButton('low')"
                    type="button"
                  >
                    Low
                    <img
                      id="lowImg"
                      src="../assets/img/Prio_low_color.png"
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div class="field-text-flex" id="addTaskAssignedTo">
                <label>Assigned to</label>
                <input
                  class="input-addtask"
                  onclick="showUsers()"
                  id="userNameInput"
                  type="text"
                  placeholder="Select contact to assign"
                  maxlength="40"
                />
                <img
                  onclick="showUsers()"
                  id="arrowDropMenuAssigned"
                  src="../assets/img/arrow_drop_down.png"
                  alt=""
                />
                <div id="dropDownUserMenu"></div>
                <div id="contentAssignedUsers"></div>
              </div>
              <div class="field-text-flex" id="addTaskSubtasks">
                <label>
                  Subtasks
                </label>
                <div class="subtask-input-wrapper">
                  <input
                    class="input-addtask"
                    id="subtaskInput"
                    class="plus-minus-drop-menu"
                    type="text"
                    placeholder="Add a new subtask"
                    maxlength="40"
                    onfocus="showClearButton()"
                  />
                  <div class="input-icons">
                    <div id="clear-add-icons" class="d-none">
                      <img
                        onclick="clearImput()"
                        src="../assets/img/close.svg"
                        alt=""
                      />
                      <div class="divider"></div>
                      <img
                        onclick="addSubtask()"
                        src="../assets/img/check1.svg"
                      />
                    </div>
                    <img
                      id="subtasks-plus-icon"
                      src="../assets/img/add1.svg"
                      type="button"
                      onclick="addSubtask()"
                    />
                  </div>
                </div>
                <ul id="subtasksContent"></ul>
              </div>
            </div>
        </form>
      </div>
      <div class="addtask-buttons ok-button">
          <div onclick="saveEdit(${i})" class="btn-create">Ok<img src="../assets/img/check.svg" /></div>
      </div>
  `;
}
