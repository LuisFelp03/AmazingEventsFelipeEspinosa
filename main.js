import { normalizarTexto, showCards, filterEvents } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const categoryCheckboxes = document.querySelectorAll('.categories input[type="checkbox"]');
    const searchButton = document.querySelector('.search-bar button');
    const container = document.getElementById('cards');
    const noResultsMessage = document.getElementById('no-results-message');

    function handleSearch(events) {
        const searchTerm = normalizarTexto(searchInput.value);
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.name);

        const filteredEvents = filterEvents(events, searchTerm, selectedCategories, new Date().toISOString().split('T')[0]);
        showCards(filteredEvents, container, noResultsMessage);
    }

    fetch('https://aulamindhub.github.io/amazing-api/events.json')
        .then(response => response.json())
        .then(data => {
            const events = data.events;
            handleSearch(events);

            searchInput.addEventListener('input', () => handleSearch(events));
            categoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => handleSearch(events));
            });
            searchButton.addEventListener('click', (event) => {
                event.preventDefault();
                handleSearch(events);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            noResultsMessage.textContent = 'Error fetching data.';
            noResultsMessage.style.display = 'block';
        });
});