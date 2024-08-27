/**
 * Opens the 'Add Contact' popup by sliding it into view, displaying the overlay, and setting up the close event listener.
 */
function openAddContact() {
  let addContact = document.getElementById("addContact");
  let overlay = document.getElementById("overlay");

  addContact.style.right = "50%";
  overlay.style.display = "flex";
  overlay.addEventListener("click", closeContactPopupByOverlay);
  document.getElementById(
    "details-mobile-add-btn"
  ).style.background = `var(--darkLightBlue)`;
}

/**
 * Closes the 'Add Contact' popup by sliding it out of view, hiding the overlay, and removing the close event listener.
 */
function closeContactPopup() {
  let addContact = document.getElementById("addContact");
  let overlay = document.getElementById("overlay");

  addContact.style.right = "-1200px";
  overlay.style.display = "none";
  overlay.removeEventListener("click", closeContactPopupByOverlay);
  document.getElementById(
    "details-mobile-add-btn"
  ).style.background = `var(--darkGray)`;
}

/**
 * Closes the 'Add Contact' popup if the overlay is clicked by checking if the event target's ID is "overlay".
 */
function closeContactPopupByOverlay(event) {
  if (event.target.id === "overlay") {
    closeContactPopup();
  }
}
