function openEditContact() {
    let editContact = document.getElementById("editContact");
    let overlayEdit = document.getElementById("overlayEdit");
      
    editContact.style.right = "50%"; // Popup nach links schieben
    overlayEdit.style.display = "flex"; // Overlay sichtbar machen
    overlayEdit.addEventListener("click", closeContactPopupByOverlay); // Event-Listener hinzufügen
  }
  
  
  function closeEditContactPopup() {
    let editContact = document.getElementById("editContact");
    let overlayEdit = document.getElementById("overlayEdit");
    
    editContact.style.right = "-1200px"; // Popup nach rechts außerhalb des Bildschirms verschieben
    overlayEdit.style.display = "none"; // Overlay unsichtbar machen
    overlayEdit.removeEventListener("click", closeEditContactPopupByOverlay); // Event-Listener entfernen
  }
  
  
  function closeEditContactPopupByOverlay(event) {
    if (event.target.id === "overlay") {
        closeEditContactPopup();
    }
  }