// Array von Kontaktobjekten, jeweils mit Namen und E-Mail-Adresse
const contacts = [
    { name: "Anton Mayer", email: "antom@gmail.com" },
    { name: "Anja Schulz", email: "schulz@hotmail.com" },
    { name: "Benedikt Ziegler", email: "benedikt@gmail.com" },
    { name: "David Eisenberg", email: "davidberg@gmail.com" },
    { name: "Eva Fischer", email: "eva@gmail.com" },
    { name: "Emmanuel Mauer", email: "emmanuelma@gmail.com" }
];

// Funktion zum Rendern der Kontakte auf der Webseite
function renderContacts() {
    // Sucht das HTML-Element mit der ID 'contact-list'
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = ''; // Löscht vorhandene Inhalte im Element

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
