// Globale Variable, um den aktuellen Prioritätszustand zu speichern
let selectedPrio = null;
let categoriesContainerClick = false;
let categories = [
    "User Story",
    "Technical Task",
    "Feature",
    "Bug",
    "Documentation",
    "Design",
    "Testing QA",
    "Analyse/Research",
  ];

function toggleButton(prioState) {
    let button = document.getElementById(prioState);
    let img = document.getElementById(prioState + 'Img');

    // Überprüfen, ob der aktuelle Button bereits aktiv ist
    if (selectedPrio === prioState) {
        // Button deaktivieren
        button.classList.remove(`btn-${prioState}-active`);
        img.src = `../assets/img/Prio_${prioState}_color.png`;
        selectedPrio = null;  // Kein Button ist mehr ausgewählt
    } else {
        // Alle anderen Buttons deaktivieren
        let priorities = ['urgent', 'medium', 'low'];
        priorities.forEach(priority => {
            let otherButton = document.getElementById(priority);
            let otherImg = document.getElementById(priority + 'Img');
            otherButton.classList.remove(`btn-${priority}-active`);
            otherImg.src = `../assets/img/Prio_${priority}_color.png`;
        });

        // Den geklickten Button aktivieren
        button.classList.add(`btn-${prioState}-active`);
        img.src = `../assets/img/Prio_${prioState}_white.png`;
        selectedPrio = prioState;  // Speichere den aktivierten Button
    }
}

// render categories in dropdown menu
function renderCategories() {
    let categoryContainer = document.getElementById('dropDownCategoryMenu');
    categoryContainer.innerHTML = '';
  
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      categoryContainer.innerHTML += `
        <div class="addtask-category" onclick="selectCategory('${category}')">
          ${category}
        </div>
      `;
    }
  }

  // wirdt gewählen eine Kategorie für die neue Aufgabe
  function selectCategory(categoryTask) {
    let categoryInput = document.getElementById('categoryInput');
    let categoryList = document.getElementById('dropDownCategoryMenu');

    categoryInput.value = categoryTask;
    hideCategories();
    categoryList.style.border = "0px";
  }

  // open the dropdown menu
  function openCategories() {
    let categoryList = document.getElementById("dropDownCategoryMenu");
    let icon = document.getElementById("categoryInput");
    icon.style.transform = "rotate(180deg)";
    categoryList.innerHTML = "";
    if (!categoriesContainerClick) {
      categoriesContainerClick = true;
      categoryList.style.border = "1px solid #CDCDCD";
      renderCategories();
    } else {
      categoriesContainerClick = false;
      categoryList.style.border = "0px";
      hideCategories();
    }
  }

  // close the dropdown menu
  function hideCategories() {
    categoriesContainerClick = false;
    let categoryList = document.getElementById("dropDownCategoryMenu");
    let icon = document.getElementById("categoryInput");
    icon.style.transform = "rotate(0deg)";
    categoryList.innerHTML = "";
  }