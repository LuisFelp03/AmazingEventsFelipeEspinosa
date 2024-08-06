import { normalizarTexto, showCards, filterEvents } from '../modules/modules.js';

// Variable para almacenar los eventos obtenidos de la API
let events = [];
const currentDate = "2023-03-10"; // Fecha actual actualizada

// Función para obtener eventos de la API
async function fetchEvents() {
    try {
        const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
        const data = await response.json();
        events = data.events; // Asigna los eventos obtenidos a la variable global
        handleFilterEvents(); // Filtra y muestra los eventos una vez obtenidos
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    }
}

// Espera a que todo el contenido de la página se haya cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input'); // Campo de búsqueda
    const categoryCheckboxes = document.querySelectorAll('.categories input[type="checkbox"]'); // Checkboxes de categorías
    const searchButton = document.querySelector('.search-bar button'); // Botón de búsqueda
    const container = document.getElementById('cards'); // Contenedor de tarjetas
    const noResultsMessage = document.getElementById('no-results-message'); // Contenedor del mensaje de no resultados    


    // Añade los eventos de escucha para los cambios en el campo de búsqueda y en los checkboxes de categorías
    searchInput.addEventListener('input', handleFilterEvents);
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterEvents);
    });
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        handleFilterEvents();
    });

    // Obtiene los eventos de la API cuando se carga la página
    fetchEvents();
});

function handleFilterEvents() {
    const searchInput = document.querySelector('.search-bar input'); // Campo de búsqueda
    const categoryCheckboxes = document.querySelectorAll('.categories input[type="checkbox"]'); // Checkboxes de categorías
    const container = document.getElementById('cards'); // Contenedor de tarjetas
    const noResultsMessage = document.getElementById('no-results-message'); // Contenedor del mensaje de no resultados 

    const searchTerm = normalizarTexto(searchInput.value); // Obtiene el término de búsqueda normalizado
    const selectedCategories = Array.from(categoryCheckboxes) // Convierte los checkboxes en un array
        .filter(checkbox => checkbox.checked) // Mantiene solo los checkboxes que están seleccionados
        .map(checkbox => checkbox.name); // Obtiene el nombre de la categoría

    const filteredEvents = filterEvents(events, searchTerm, selectedCategories, currentDate, true, false); // Mostrar eventos pasados

    // Muestra los eventos filtrados en la página
    showCards(filteredEvents, container, noResultsMessage);
}