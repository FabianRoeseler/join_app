function openAddTaskPopup() {
    let addTaskPopup = document.getElementById("addTaskPopup");
    let overlay = document.getElementById("overlayAddTaskPopup");
      
    addTaskPopup.style.right = "50%"; // Popup nach links schieben
    overlay.style.display = "flex"; // Overlay sichtbar machen
    overlay.addEventListener("click", closeAddTaskPopupByOverlay); // Event-Listener hinzufügen
    document.getElementById('details-mobile-add-btn').style.background = `var(--darkLightBlue)`; // ändert Farbe vom Hinzufügen Button
  }
  
  
  function closeAddTaskPopup() {
    let addTaskPopup = document.getElementById("addTaskPopup");
    let overlay = document.getElementById("overlayAddTaskPopup");
    
    addTaskPopup.style.right = "-1200px"; // Popup nach rechts außerhalb des Bildschirms verschieben
    overlay.style.display = "none"; // Overlay unsichtbar machen
    overlay.removeEventListener("click", closeAddTaskPopupByOverlay); // Event-Listener entfernen
    document.getElementById('details-mobile-add-btn').style.background = `var(--darkGray)`; // ändert Farbe vom Hinzufügen Button zurück
  
  }
  
  
  function closeAddTaskPopupByOverlay(event) {
    if (event.target.id === "overlayAddTaskPopup") {
        closeAddTaskPopup();
    }
  }