/**
 * Handling for the contact edit popup
 */
function openEditContact() {
  let editContact = document.getElementById("editContact");
  let overlayEdit = document.getElementById("overlayEdit");

  editContact.style.right = "50%";
  overlayEdit.style.display = "flex";
  overlayEdit.addEventListener("click", closeEditContactPopupByOverlay);
}

function closeEditContactPopup() {
  let editContact = document.getElementById("editContact");
  let overlayEdit = document.getElementById("overlayEdit");

  editContact.style.right = "-1200px";
  overlayEdit.style.display = "none";
  overlayEdit.removeEventListener("click", closeEditContactPopupByOverlay);
}

function closeEditContactPopupByOverlay(event) {
  if (event.target.id === "overlay") {
    closeEditContactPopup();
  }
}
