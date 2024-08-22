const ADD_URL =
  "https://join-4da86-default-rtdb.europe-west1.firebasedatabase.app/";

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

    let toDoCount = tasks.filter((t) => t["status"] == "to_do").length;
    document.getElementById('render-to-do-count').innerHTML = `${toDoCount}`;

    let doneCount = tasks.filter((t) => t["status"] == "done").length;
    document.getElementById('render-done-count').innerHTML = `${doneCount}`;

    let urgentCount = tasks.filter((t) => t["prio"][0] == "urgent").length;
    document.getElementById('render-urgent-count').innerHTML = `${urgentCount}`;

    getnextUrgentDate();

    let allTasks = tasks.length;
    document.getElementById('tasks-in-board-count').innerHTML = `${allTasks}`;

    let inProgressCount = tasks.filter((t) => t["status"] == "in_progress").length;
    document.getElementById('tasks-in-progress-count').innerHTML = `${inProgressCount}`;

    let awaitFeedbackCount = tasks.filter((t) => t["status"] == "await_feedback").length;
    document.getElementById('tasks-await-feedback-count').innerHTML = `${awaitFeedbackCount}`;


    console.log(urgentCount);
    
}

function getnextUrgentDate() {
    index_urgent = [];
    urgent_dates = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]["prio"][0] === "urgent") {
          index_urgent.push(i);
        }
      }
    console.log(index_urgent);
    
    for (let j = 0; j < index_urgent.length; j++) {
        let date = tasks[index_urgent[j]]["due_date"];
        urgent_dates.push(date); 
    }
    console.log(urgent_dates);
    
    urgent_dates.sort(function(a, b) {
        return new Date(a) - new Date(b);
    })

    let nextDate = urgent_dates[0];
    let dateObjekt = new Date(nextDate);

    let formatedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(dateObjekt);

    document.getElementById('rendered-deadline').innerHTML = `${formatedDate}`;
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingCont = document.getElementById('variable-greeting');
    const greetingContMobile = document.getElementById('variable-greeting-mobile');
    
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

 // Aktualisierung jede Stunde (3600000 Millisekunden)
 setInterval(updateGreeting, 3600000); // 3600000 ms = 1 Stunde
  