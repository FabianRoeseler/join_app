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

  let subtaskIdCounter = 0; // Zähler für eindeutige IDs

  // Funktion zum Hinzufügen einer Unteraufgabe
  function addSubtask() {
      const subtaskInput = document.getElementById('subtaskInput');
      const subtasksContent = document.getElementById('subtasksContent');
  
      if (subtaskInput.value.trim() !== '') {
          subtaskIdCounter++; // Erhöhe den Zähler für die ID
  
          const liId = 'subtask-' + subtaskIdCounter; // Erzeuge eine eindeutige ID für das li-Element
          const spanId = 'span-' + subtaskIdCounter; // ID für das span-Element
          const inputId = 'input-' + subtaskIdCounter; // ID für das Input-Element
  
          // Erstelle das neue li-Element als HTML-String
          const newSubtaskHTML = `
              <li id="${liId}">
                  <span id="${spanId}" onclick="editSubtask('${liId}', '${spanId}', '${inputId}')">${subtaskInput.value}</span>
                  <button onclick="deleteSubtask('${liId}')">🗑️</button>
              </li>
          `;
  
          // Füge das neue li-Element zur bestehenden Liste hinzu
          subtasksContent.innerHTML += newSubtaskHTML;
  
          subtaskInput.value = ''; // Leert das Eingabefeld
      }
  }
  
  // Funktion zum Bearbeiten einer Unteraufgabe
  function editSubtask(liId, spanId, inputId) {
      const spanElement = document.getElementById(spanId); // Hole das span-Element
      const li = document.getElementById(liId); // Hole das li-Element
      const currentText = spanElement.textContent; // Textinhalt des span-Elements
  
      // Ersetze den span-Inhalt durch ein Eingabefeld und Buttons
      const editSubtaskHTML = `
          <input id="${inputId}" type="text" value="${currentText}">
          <button onclick="saveSubtask('${liId}', '${inputId}')">✔️</button>
          <button onclick="deleteSubtask('${liId}')">🗑️</button>
      `;
      
      li.innerHTML = editSubtaskHTML; // Setze den neuen Inhalt für das li-Element
  }
  
  // Funktion zum Speichern einer bearbeiteten Unteraufgabe
  function saveSubtask(liId, inputId) {
      const li = document.getElementById(liId); // Hole das li-Element
      const input = document.getElementById(inputId); // Hole das Input-Element
      
      // Übernehme den bearbeiteten Text und stelle die ursprüngliche Ansicht wieder her
      const saveSubtaskHTML = `
          <span id="span-${liId}" onclick="editSubtask('${liId}', 'span-${liId}', 'input-${liId}')">${input.value}</span>
          <button onclick="deleteSubtask('${liId}')">🗑️</button>
      `;
  
      li.innerHTML = saveSubtaskHTML; // Setze den neuen Inhalt für das li-Element
  }
  
  // Funktion zum Löschen einer Unteraufgabe
  function deleteSubtask(liId) {
      const li = document.getElementById(liId); // Hole das li-Element
      li.remove(); // Entferne das li-Element aus der Liste
  }
  
  // Funktion zum Leeren des Eingabefelds
  function clearSubtaskInput() {
      document.getElementById('subtaskInput').value = ''; // Leert das Eingabefeld
  }
  