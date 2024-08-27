const ADD_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Getting DB data for summary
 */
async function renderKeyMetrics() {
  tasks = [];
  let response = await fetch(ADD_URL + ".json");
  const data = await response.json();
  if (data && typeof data === "object" && data.tasks) {
    tasksArray = data.tasks;
    let ObjEntries = Object.entries(tasksArray);
    for (let index = 0; index < ObjEntries.length; index++) {
      const task = ObjEntries[index][1];
      tasks.push(task);
    }
  }
  fillKeyMetrics(tasks);
}

/**
 * Rendering summarydata in HTML
 */
function fillKeyMetrics(tasks) {
  let toDoCount = tasks.filter((t) => t["status"] == "to_do").length;
  document.getElementById("render-to-do-count").innerHTML = `${toDoCount}`;
  let doneCount = tasks.filter((t) => t["status"] == "done").length;
  document.getElementById("render-done-count").innerHTML = `${doneCount}`;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if ("prio" in task) {
      let urgentCount = tasks.filter((t) => t["prio"][0] == "urgent").length;
      document.getElementById(
        "render-urgent-count"
      ).innerHTML = `${urgentCount}`;
      getNextUrgentDate();
    } else {
      document.getElementById("render-urgent-count").innerHTML = `0`;
      document.getElementById(
        "upcoming-deadline"
      ).innerHTML = `No Urgent Deadlines`;
    }
  }
  fillKeyMetricsAmounts(tasks);
}

function fillKeyMetricsAmounts(tasks) {
  let allTasks = tasks.length;
  document.getElementById("tasks-in-board-count").innerHTML = `${allTasks}`;
  let inProgressCount = tasks.filter(
    (t) => t["status"] == "in_progress"
  ).length;
  document.getElementById(
    "tasks-in-progress-count"
  ).innerHTML = `${inProgressCount}`;
  let awaitFeedbackCount = tasks.filter(
    (t) => t["status"] == "await_feedback"
  ).length;
  document.getElementById(
    "tasks-await-feedback-count"
  ).innerHTML = `${awaitFeedbackCount}`;
}

/**
 * Selecting next urgent date for summary and display in HTML
 */
function getNextUrgentDate() {
  index_urgent = [];
  urgent_dates = [];
  getUrgentData();
  urgent_dates.sort(function (a, b) {
    return new Date(a) - new Date(b);
  });
  let nextDate = urgent_dates[0];
  let dateObjekt = new Date(nextDate);
  let formatedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObjekt);
  document.getElementById("rendered-deadline").innerHTML = `${formatedDate}`;
}

function getUrgentData() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["prio"][0] === "urgent") {
      index_urgent.push(i);
    }
  }
  for (let j = 0; j < index_urgent.length; j++) {
    let date = tasks[index_urgent[j]]["due_date"];
    urgent_dates.push(date);
  }
}

/**
 * Checking user and displaying the correct greeting in summary
 */
function checkUserStatus() {
  if (localStorage.getItem("pageLoaded") == null) {
    if (localStorage.getItem("username") == null) {
      updateGreetingGuest();
      showMobileGreeting();
    } else {
      updateGreeting();
      getUsername();
      showMobileGreeting();
    }
    localStorage.setItem("pageLoaded", "true");
  } else {
    if (localStorage.getItem("username") == null) {
      updateGreetingGuest();
    } else {
      updateGreeting();
      getUsername();
    }
  }
}

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greetingCont = document.getElementById("variable-greeting");
  const greetingContMobile = document.getElementById(
    "variable-greeting-mobile"
  );
  let greeting;
  if (hour >= 6 && hour < 12) {
    greeting = "Good Morning,";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon,";
  } else if (hour >= 18 && hour < 24) {
    greeting = "Good Evening,";
  } else {
    greeting = "Good Night,";
  }
  greetingCont.innerHTML = greeting;
  greetingContMobile.innerHTML = greeting;
}

function updateGreetingGuest() {
  const now = new Date();
  const hour = now.getHours();
  const greetingCont = document.getElementById("variable-greeting");
  const greetingContMobile = document.getElementById(
    "variable-greeting-mobile"
  );
  let greeting;
  if (hour >= 6 && hour < 12) {
    greeting = "Good Morning!";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon!";
  } else if (hour >= 18 && hour < 24) {
    greeting = "Good Evening!";
  } else {
    greeting = "Good Night!";
  }

  greetingCont.innerHTML = greeting;
  greetingContMobile.innerHTML = greeting;
  document.getElementById("greeting-user-name").classList.add("d-none");
  document.getElementById("greeting-user-name-mobile").classList.add("d-none");
}

/**
 * Updating greeting time for correct greeting
 */
setInterval(updateGreeting, 3600000);
setInterval(updateGreetingGuest, 3600000);

/**
 * Getting and saving username for display in summary
 */
function saveUsernameLocal(username) {
  localStorage.setItem("username", username);
}

function getUsername() {
  let storedUserName = localStorage.getItem("username");
  setUserGreeting(storedUserName);
}

/**
 * Display user in greeting, app and mobile
 */
function setUserGreeting(username) {
  document.getElementById("greeting-user-name").innerHTML = `${username}`;
  document.getElementById(
    "greeting-user-name-mobile"
  ).innerHTML = `${username}`;
}

function showMobileGreeting() {
  if (window.innerWidth < 1210) {
    document.getElementById("greeting-user-mobile").classList.remove("d-none");
    setTimeout(hideMobileGreeting, 2000);
  }
}

function hideMobileGreeting() {
  document.getElementById("greeting-user-mobile").classList.add("d-none");
}
