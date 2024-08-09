// Globale Variable, um den aktuellen Prioritätszustand zu speichern
let selectedPrio = null;

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
