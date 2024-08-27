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

function closeContactPopupByOverlay(event) {
  if (event.target.id === "overlay") {
    closeContactPopup();
  }
}
