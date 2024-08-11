let tasks = [
    {
        "id" : 0,
        "title" : "Kochwelt Page & Recipe Recommender",
        "description" : "Build start page with recipe recommendation",
        "assigned_to" : ["AM", "EM", "MB"],
        "due_date" : "06/10/2024",
        "prio" : "medium",
        "prio_img" : "../assets/img/prio_medium.svg",
        "category" : ["User Story", "#0038FF"],
        "subtasks" : ["subtask1", "subtask2"],
        "subtasks_done" : ["subtask1","2"],
        "progress" : "",
        "status" : "to_do"
    },
    {
        "id" : 1,
        "title" : "HTML Base Template Creation",
        "description" : "Create reusable HTML base templates",
        "assigned_to" : ["AM", "EM", "MB"],
        "due_date" : "07/10/2024",
        "prio" : "low",
        "prio_img" : "../assets/img/prio_low.svg",
        "category" : ["Technical Task", "#1FD7C1"],
        "subtasks" : ["subtask1", "subtask2", "subtask3"],
        "subtasks_done" : ["1"],
        "progress" : "",
        "status" : "in_progress"
    }
]

let currentDraggedElement;
let tasksArray = {};

const BASE_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTasks() {
    let response = await fetch(BASE_URL + ".json");
    const data = await response.json();
    if (data && typeof data === "object" && data.tasks) {
      tasksArray = data.tasks;
      console.log("Tasks Array:", tasksArray); // remove later
     /*  displayTasks(tasksArray); */ // activate when displazFunction is ready
    }
  }

  async function addTask(path = "tasks") {
   /*  let taskName = document.getElementById("inputfield"); */ // define the inputfields by ID
  
    let data = {

        title: "Kochwelt Page & Recipe Recommender",
        description: "Build start page with recipe recommendation",
        assigned_to: ["AM", "EM", "MB"],
        due_date: "06/10/2024",
        prio: "medium",
        prio_img: "../assets/img/prio_medium.svg",
        category: ["User Story", "#0038FF"],
        subtasks: ["subtask1", "subtask2"],
        subtasks_done: ["subtask1"],
        progress: "",
        status: "to_do",

/*         The Values of the Fields must be defined for the data!
      username: userNameInput.value,
      email: emailInput.value,
      contactNumber: phoneInput.value */
    };
  
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await loadTasks();
    /* cleanInputFields(); */ // add a function to clean the inputfields
    return await response.json();
  }

  async function deleteTask(i) {
    // Sortiere die Benutzer und ermittle den Benutzer anhand des Index
    let sortedTasks = Object.values(tasksArray);
    console.log(sortedTasks);
    let taskId = Object.keys(tasksArray).find(
      (key) => tasksArray[key] === sortedTasks[i]
    );
    console.log(taskId);
  
    let response = await fetch(BASE_URL + "tasks/" + taskId + ".json", {
      method: "DELETE",
    });
    await loadTasks();
    return await response.json();
  }

function updateHTML() {
    let to_do = tasks.filter(t => t['status'] == 'to_do');
    document.getElementById('to_do').innerHTML = '';
    for (let i = 0; i < to_do.length; i++) {
        const element = to_do[i];
        document.getElementById('to_do').innerHTML += generateToDoHTML(element);
    }

    let in_progress = tasks.filter(t => t['status'] == 'in_progress');
    document.getElementById('in_progress').innerHTML = '';
    for (let i = 0; i < in_progress.length; i++) {
        const element = in_progress[i];
        document.getElementById('in_progress').innerHTML += generateToDoHTML(element);
    }

    let await_feedback = tasks.filter(t => t['status'] == 'await_feedback');
    document.getElementById('await_feedback').innerHTML = '';
    for (let i = 0; i < await_feedback.length; i++) {
        const element = await_feedback[i];
        document.getElementById('await_feedback').innerHTML += generateToDoHTML(element);
    }

    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const element = done[i];
        document.getElementById('done').innerHTML += generateToDoHTML(element);
    }
}

function generateToDoHTML(element) {
    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="task">
            <div class="task-category" style="background : ${element.category[1]}">${element.category[0]}</div>
            <span id="task-title">${element.title}</span>
            <span id="task-description">${element.description}</span>
            <div class="subtasks">
                <div id="subtask-progress">
                    <div id="progress-bar" style="width:${100/element.subtasks.length*element.subtasks_done.length}%"></div>
                </div>
                <div id="subtask-counter">${element.subtasks_done.length}/${element.subtasks.length} Subtasks</div>
            </div>
            <div class="assigned-prio-cont">
                <div id="assigned-initials">
                    <div class="test-initials">${element.assigned_to[0]}</div>
                    <div class="test-initials bg-green">${element.assigned_to[1]}</div>
                    <div class="test-initials bg-violet">${element.assigned_to[2]}</div>
                </div>
                <div id="task-prio">
                    <img class="prio-icons" src="${element.prio_img}" alt="prio icon">
                </div>
            </div>
        </div>
    `;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
  }

function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    updateHTML();
}