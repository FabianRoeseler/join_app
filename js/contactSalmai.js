// Array von Kontaktobjekten, jeweils mit Namen und E-Mail-Adresse
const contacts = [
    { name: "Anton Mayer", email: "antom@gmail.com" },
    { name: "Anja Schulz", email: "schulz@hotmail.com" },
    { name: "Benedikt Ziegler", email: "benedikt@gmail.com" },
    { name: "David Eisenberg", email: "davidberg@gmail.com" },
    { name: "Eva Fischer", email: "eva@gmail.com" },
    { name: "Emmanuel Mauer", email: "emmanuelma@gmail.com" },
    { name: "Salmai Safi", email: "salmaisafi@gmail.com" },
    { name: "Balmai Afi", email: "salmaisafi@gmail.com" }
];

// Funktion zum Rendern der Kontakte auf der Webseite
function renderContacts() {
    // Sucht das HTML-Element mit der ID 'contact-list'
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = ''; // Löscht vorhandene Inhalte im Element

    // Kontakte nach Namen sortieren
    contacts.sort((a, b) => a.name.localeCompare(b.name));


    let lastInitial = ''; // Variable zur Speicherung des letzten Buchstabens für Gruppierung
    for (let contact of contacts) { // Schleife durch alle Kontakte
        let initial = contact.name[0].toUpperCase(); // Holt den ersten Buchstaben des Namens und macht ihn groß

        if (initial !== lastInitial) {
            // Wenn das Initial anders ist als das letzte, füge eine neue Buchstabenüberschrift hinzu
            contactList.innerHTML += `<h3>${initial}</h3><hr>`;
            lastInitial = initial; // Aktualisiert das letzte Initial
        }

        // Fügt den HTML-Code für einen Kontakt hinzu
        contactList.innerHTML += `
            <div class="contact">
                <div class="initials" style="background-color: ${generateRandomColor()};">${getInitials(contact.name)}</div>
                <div class="contact-info">
                    <p class="name"><span>${contact.name}</span></p>
                    <p class="email"><a href="mailto:${contact.email}">${contact.email}</a></p>
                </div>
            </div>
        `;
    }
}

// Funktion um Intitialen aus einem Namen zu holen
function getInitials(name) {
    // Teilt den Namen in Wörter auf und holt das erste Zeichen jedes Wortes
    return name.split(' ').map(word => word[0]).join('');
}

// Funktion zur Erzeugung einer zufälligen Farbe
function generateRandomColor() {
    const letters = '0123456789ABCDEF'; // Damit Zufällig eine Farbe erstellt wird aus dieser Kombination
    let color = '#'; // Startet die Farbe mit '#' damit Farbe gesetzt werden kann
    for (let i = 0; i < contacts.length; i++) { // Schleife für 6 Zeichen, um eine vollständige Farbe zu erstellen
        color += letters[Math.floor(Math.random() * 16)]; // Wählt ein zufälliges Zeichen aus der Zifferkombination aus
    }
    return color; // Gibt die generierte Farbe zurück
}

// Event Listener, der die renderContacts-Funktion aufruft, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', renderContacts);

// Funktion um die Kontakt-Detail-Ansicht zu rendern
/**
 * function to render one contact of the contact list into the big contact detail 
 * @param {*} i 
 */

function renderContactDetails(i) {
    let contactDetail = document.getElementById('render-contact-details');
    let users = loadedUserArray;

    contactDetail.innerHTML = /*html*/`
        <div class="render-details-head">
            <div id="initials-detail" class="profile-initials">${getInitials(users[`user${i}`].username)}</div>
                <div>
                    <div class="profile-name">${users[`user${i}`].username}</div>
                    <div class="edit-delete-cont">
                        <div class="edit-delete-child">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_207322_3882" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_207322_3882)">
                                    <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                                </g>
                            </svg>
                            <span onclick="openEditContact()">Edit</span>
                        </div>
                        <div class="edit-delete-child">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_207322_4146" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_207322_4146)">
                                    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
                                </g>
                            </svg>
                            <span>Delete</span>
                        </div>
                </div>
            </div>
        </div>
        <div class="render-details-info">
            <div class="contact-info-headline">Contact Information</div>
            <div>
                <div class="single-info">
                    <span><b>Email</b></span>
                    <span><a href="mailto:${users[`user${i}`].email}">${users[`user${i}`].email}</a></span>
                </div>
                <div class="single-info">
                    <span><b>Phone</b></span>
                    <span>${users[`user${i}`].contactNumber}</span>
                </div>
            </div>
        </div>
    `;
    contactDetail.style = `width: 100%; left: 0;`;
    document.getElementById('initials-detail').style.background = `${colors[i - 1]}`;
}
