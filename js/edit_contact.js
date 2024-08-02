function openAddContact() {
    let addContact = document.getElementById("editContact");
    let overlay = document.getElementById("overlay");
      
    addContact.style.right = "50%"; // Popup nach links schieben
    overlay.style.display = "flex"; // Overlay sichtbar machen
    overlay.addEventListener("click", closeContactPopupByOverlay); // Event-Listener hinzufügen
  }
  
  
  function closeContactPopup() {
    let addContact = document.getElementById("editContact");
    let overlay = document.getElementById("overlay");
    
    addContact.style.right = "-1200px"; // Popup nach rechts außerhalb des Bildschirms verschieben
    overlay.style.display = "none"; // Overlay unsichtbar machen
    overlay.removeEventListener("click", closeContactPopupByOverlay); // Event-Listener entfernen
  }
  
  
  function closeContactPopupByOverlay(event) {
    if (event.target.id === "overlay") {
        closeContactPopup();
    }
  }