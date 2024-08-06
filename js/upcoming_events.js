import { normalizarTexto, showCards, filterEvents } from '../modules/modules.js';

// Espera a que todo el contenido de la página se haya cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input'); // Campo de búsqueda
    const categoryCheckboxes = document.querySelectorAll('.categories input[type="checkbox"]'); // Checkboxes de categorías
    const searchButton = document.querySelector('.search-bar button'); // Botón de búsqueda
    const container = document.getElementById('cards'); // Contenedor de tarjetas
    const noResultsMessage = document.getElementById('no-results-message'); // Contenedor del mensaje de no resultados    

    // Función para filtrar y mostrar las tarjetas de eventos
    function handleFilterEvents(events, currentDate) {
        const searchTerm = normalizarTexto(searchInput.value); // Obtiene el término de búsqueda normalizado
        const selectedCategories = Array.from(categoryCheckboxes) // Convierte los checkboxes en un array
            .filter(checkbox => checkbox.checked) // Mantiene solo los checkboxes que están seleccionados
            .map(checkbox => checkbox.value); // Obtiene el valor de la categoría

        const filteredEvents = filterEvents(events, searchTerm, selectedCategories, currentDate, false, true);

        // Muestra los eventos filtrados en la página
        showCards(filteredEvents, container, noResultsMessage);
    }

    // Obtiene los datos de la API
    fetch('https://aulamindhub.github.io/amazing-api/events.json')
        .then(response => response.json())
        .then(data => {
            const events = data.events; // Obtiene los eventos de la respuesta de la API
            const currentDate = data.currentDate; // Obtiene la fecha actual de la respuesta de la API

            // Muestra todos los eventos próximos cuando se carga la página por primera vez
            handleFilterEvents(events, currentDate);

            // Añade los eventos de escucha para los cambios en el campo de búsqueda y en los checkboxes de categorías
            searchInput.addEventListener('input', () => handleFilterEvents(events, currentDate));
            categoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => handleFilterEvents(events, currentDate));
            });
            searchButton.addEventListener('click', (event) => {
                event.preventDefault();
                handleFilterEvents(events, currentDate);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            noResultsMessage.textContent = 'Error fetching data.';
            noResultsMessage.style.display = 'block';
        });
});