export function normalizarTexto(texto) {
    return texto.toLowerCase();
}

export function showCards(events, container, noResultsMessage) {
    container.innerHTML = '';

    if (events.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
        events.forEach(event => {
            let card = document.createElement('div');
            card.className = 'col-lg-3 col-md-6 mb-4 d-flex align-items-stretch';

            card.innerHTML = `
                <div class="card text-center">
                    <img src="${event.image}" class="card-img-top" alt="${event.name}">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text">${event.description}</p>
                        <p class="card-text"><strong>Price:</strong> $${event.price}</p>
                        <a href="event-details.html?id=${event._id}" class="btn btn-primary">DETAILS</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }
}

export function filterEvents(events, searchTerm, selectedCategories, currentDate, showPast = false, showFuture = false) {
    const currentDateObj = new Date(currentDate);

    let filteredEvents = events;

    if (showPast && showFuture) {
        filteredEvents = events;
    } else if (showPast) {
        filteredEvents = events.filter(event => new Date(event.date) < currentDateObj);
    } else if (showFuture) {
        filteredEvents = events.filter(event => new Date(event.date) > currentDateObj);
    }

    if (selectedCategories.length > 0) {
        filteredEvents = filteredEvents.filter(event => selectedCategories.includes(event.category));
    }

    if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
            normalizarTexto(event.name).includes(searchTerm)
        );
    }

    return filteredEvents;
}
