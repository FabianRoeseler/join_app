function openAddContact() {
  let addContact = document.getElementById("addContact");
  let overlay = document.getElementById("overlay");
    
  addContact.style.right = "50%"; // Popup nach links schieben
  overlay.style.display = "flex"; // Overlay sichtbar machen
  overlay.addEventListener("click", closeContactPopupByOverlay); // Event-Listener hinzufügen
  document.getElementById('details-mobile-add-btn').style.background = `var(--darkLightBlue)`; // ändert Farbe vom Hinzufügen Button
}


function closeContactPopup() {
  let addContact = document.getElementById("addContact");
  let overlay = document.getElementById("overlay");
  
  addContact.style.right = "-1200px"; // Popup nach rechts außerhalb des Bildschirms verschieben
  overlay.style.display = "none"; // Overlay unsichtbar machen
  overlay.removeEventListener("click", closeContactPopupByOverlay); // Event-Listener entfernen
  document.getElementById('details-mobile-add-btn').style.background = `var(--darkGray)`; // ändert Farbe vom Hinzufügen Button zurück

}


function closeContactPopupByOverlay(event) {
  if (event.target.id === "overlay") {
      closeContactPopup();
  }
}



