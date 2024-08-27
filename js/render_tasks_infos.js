  /**
   * updates the HTML content of the element with the specified id to display the description property of the provided element
   * 
   * @param {*} element 
   * @param {*} id 
   */
  function renderTaskDescription(element, id) {
    document.getElementById(id).innerHTML = `${element.description}`;
  }
  
  /**
   * displays the progress of subtasks, showing a progress bar and a counter based on the number of completed and total subtasks
   * 
   * @param {*} element 
   * @param {*} id 
   */
  function renderSubtaskProgress(element, id) {
    let progress = document.getElementById(id);
  
    if ("subtasks_done" in element) {
      progress.innerHTML = /*html*/ `
      <div id="subtask-progress">
          <div id="progress-bar" style="width:${(100 / element.subtasks.length) * element.subtasks_done.length
        }%"></div>
      </div>
      <div id="subtask-counter">${element.subtasks_done.length}/${element.subtasks.length
        } Subtasks</div>
      `;
    } else {
      progress.innerHTML = /*html*/ `
      <div id="subtask-progress">
          <div id="progress-bar" style="width:${(100 / element.subtasks.length) * 0
        }%"></div>
      </div>
      <div id="subtask-counter">0/${element.subtasks.length} Subtasks</div>
      `;
    }
  }
  
  /**
   * displays the initials of assigned users for a task, showing individual initials for up to 5 users and a summary indicator (+N) if there are more than 6 users
   * 
   * @param {*} element 
   * @param {*} initialsCont 
   */
  function renderIntialsinSmallTask(element, initialsCont) {
    let users = element.assigned_users;
    if (users.length < 6) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        document.getElementById(initialsCont).innerHTML += `
          <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
        `;
      }
    }
    if (users.length > 6) {
      for (let i = 0; i < users.length - (users.length - 5); i++) {
        const user = users[i];
        document.getElementById(initialsCont).innerHTML += `
          <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
        `;
      }
      document.getElementById(initialsCont).innerHTML += `
        <div class="test-initials" style="background-color: #2A3647">+${users.length - 5}</div>
      `;
    }
  }
  
  /**
   * displays a priority icon for the task
   * 
   * @param {*} element 
   * @param {*} id 
   */
  function renderTaskPrio(element, id) {
    document.getElementById(id).innerHTML = `<img class="prio-icons" src="${element.prio[1]
      }" alt="prio icon">`;
  }

    /**
   * updates the task details by conditionally rendering assigned user contacts and subtasks if those properties are present
   * 
   * @param {*} task 
   * @param {*} i 
   */
    function renderInfosInTaskDetails(task, i) {
        if ("assigned_users" in task) {
          renderAssignedContacts(task);
        } else {
          document.getElementById(`assigned-users-cont${i}`).classList.add("d-none");
        }
        if ("subtasks" in task) {
          renderSubtasks(task, i);
        } else {
          document.getElementById(`subtasks-cont${i}`).classList.add("d-none");
        }
        renderInfosInTaskDetailsTwo(task, i);
      }
      
      /**
       * updates the task details by conditionally rendering the task description and priority if those properties are present
       * 
       * @param {*} task 
       * @param {*} i 
       */
      function renderInfosInTaskDetailsTwo(task, i) {
        if ("description" in task) {
          renderDescriptionInTaskDetails(task, i);
        } else {
          document
            .getElementById(`task-details-description${i}`)
            .classList.add("d-none");
        }
        if ("prio" in task) {
          renderPrioInTaskDetails(task, i);
        } else {
          document.getElementById(`task-details-prio${i}`).classList.add('d-none');
        }
      }
    
      
      /**
       * displays the description of the task details
       * 
       * @param {*} task 
       * @param {*} i 
       */
      function renderDescriptionInTaskDetails(task, i) {
        document.getElementById(
          `task-details-description${i}`
        ).innerHTML = `${task.description}`;
      }
      
      /**
       * displays the task's priority, including a capitalized priority label and an associated icon image
       * 
       * @param {*} task 
       * @param {*} i 
       */
      function renderPrioInTaskDetails(task, i) {
        let prio = document.getElementById(`prio-cont${i}`);
        prio.innerHTML = /*html*/`
            <span>${task.prio[0].charAt(0).toUpperCase() + task.prio[0].slice(1)}</span>
            <img src="${task.prio[1]}">
        `;
      }
      
      /**
       * populates the assigned-contacts element with a list of assigned users for the given task, displaying each user's initials and username
       * 
       * @param {*} task 
       */
      function renderAssignedContacts(task) {
        let contacts = document.getElementById("assigned-contacts");
        contacts.innerHTML = "";
      
        for (let i = 0; i < task.assigned_users.length; i++) {
          const user = task.assigned_users[i];
      
          contacts.innerHTML += `
                    <div class="assigned-single-contact">
                        <div class="test-initials" style="background-color: ${user.color}">${user.initials}</div>
                        <span>${user.username}</span>
                    </div>
                `;
        }
      }
      
      /**
       * display a list of subtasks for the given task, including each subtask's description and a checkbox image that triggers a function to mark the subtask as done when clicked
       * 
       * @param {*} task 
       * @param {*} i 
       */
      function renderSubtasks(task, i) {
        let subtasks = document.getElementById(`subtasks-details${i}`);
        subtasks.innerHTML = "";
      
        for (let j = 0; j < task.subtasks.length; j++) {
          subtasks.innerHTML += /*html*/ `
                  <div class="subtask-cont">
                      <div class="subtask-cont-img" onclick="moveToSubtasksDone(${i}, ${j})">
                          <img id="checkbox${j}" src="${task.subtasks[j].checkbox_img}">
                      </div>
                      <div>${task.subtasks[j].subtask}</div>
                  </div>
              `;
        }
      }
      
      /**
       * renders the selected users in the edit PopUp
       */
      function renderSelectedUsersEdit() {
        let selectedUsers = document.getElementById('contentAssignedUsers');
        selectedUsers.innerHTML = "";
        for (let i = 0; i < assignedUsersEdit.length; i++) {
          const user = assignedUsersEdit[i];
      
          getUserId(user.username);
        }
      }

/**
 * populates the subtasksContent element with a list of subtasks from the subtasksEdit array
 */
function renderSubtasksEdit() {
    let selectedSubtasks = document.getElementById("subtasksContent");
    selectedSubtasks.innerHTML = "";
    for (let i = 0; i < subtasksEdit.length; i++) {
      const element = subtasksEdit[i];
  
      selectedSubtasks.innerHTML += /*html*/ `
        <li id="subtask-${i}" class="subtask-item">
            <div class="dot"></div>
            <div class="subtask-text">
                <span id="span-${i}" onclick="editSubtask('subtask-${i}', 'span-${i}', 'input-${i}')">${element.subtask}</span>
            </div>
            <div class="subtask-icon">
                <img onclick="editSubtask('subtask-${i}', 'span-${i}', 'input-${i}')" src="../assets/img/edit.svg" alt="edit">
                <div class="divider"></div>
                <img onclick="deleteFromSubtaskArr('${element.subtask}')" src="../assets/img/delete.svg" alt="delete">
            </div>
        </li>
        `;
    }
  }
  
    