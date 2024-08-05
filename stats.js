const datos = async () => {
    try {
        const data = await fetchData();
        const dataEvents = data.events;
        const currentDate = data.currentDate;

        const cell1 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(1)");
        const cell2 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(2)");
        const cell3 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(3)");

        const table2 = document.getElementById("table-2");
        const table3 = document.getElementById("table-3");

        const filterPast = dataEvents.filter(item => item.date < currentDate);
        const filterUpcoming = dataEvents.filter(item => item.date > currentDate);

        const eventPlusAssistance = plusAssistanceEvent(filterPast);
        const percentAssistPlus = ((eventPlusAssistance.assistance / eventPlusAssistance.capacity) * 100).toFixed(2);

        const minusAssistance = minusAssistanceEvent(filterPast);
        const percentAssistMinus = ((minusAssistance.assistance / minusAssistance.capacity) * 100).toFixed(2);

        const highestCapacityEvent = plusCapacityEvent(dataEvents);

        const highestAssistanceEvent = `${eventPlusAssistance.name} - ${percentAssistPlus}%`;
        const lowestAssistanceEvent = `${minusAssistance.name} - ${percentAssistMinus}%`;
        const highestCapacity = `${highestCapacityEvent.name} - ${highestCapacityEvent.capacity.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

        cell1.textContent = highestAssistanceEvent;
        cell2.textContent = lowestAssistanceEvent;
        cell3.textContent = highestCapacity;

        const arrTotalUpCategories = comingEventsStatistics(filterUpcoming);
        renderTable2Template(arrTotalUpCategories, table2);

        const arrTotalPerCategories = pastEventsStatistics(filterPast);
        renderTable3Template(arrTotalPerCategories, table3);
    } catch (err) {
        console.log("Error:", err);
    }
};
datos();

function plusAssistanceEvent(arr) {
    return arr.reduce((max, item) => {
        const ratio = item.assistance / item.capacity;
        return ratio > (max.assistance / max.capacity) ? item : max;
    });
}

function minusAssistanceEvent(arr) {
    return arr.reduce((min, item) => {
        const ratio = item.assistance / item.capacity;
        return item.assistance >= 0 && ratio < (min.assistance / min.capacity) ? item : min;
    });
}

function plusCapacityEvent(arr) {
    return arr.reduce((max, item) => item.capacity > max.capacity ? item : max);
}

function comingEventsStatistics(arr) {
    const statistics = arr.reduce((acc, item) => {
        const { category, price, estimate, capacity } = item;

        if (!acc[category]) {
            acc[category] = { revenues: 0, estimate: 0, capacity: 0, eventCount: 0, percentageEstimate: 0 };
        }

        acc[category].revenues += price * estimate;
        acc[category].estimate += estimate;
        acc[category].capacity += capacity;
        acc[category].eventCount += 1;

        acc[category].percentageEstimate += (estimate / capacity) * 100;

        return acc;
    }, {});

    for (let category in statistics) {
        statistics[category].percentageEstimate /= statistics[category].eventCount;
    }

    return statistics;
}

function createTable2Template(keyItem, item) {
    return `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${item.revenues.toLocaleString()}</td>
            <td>${item.percentageEstimate.toFixed(2)} %</td>
        </tr>
    `;
}

function renderTable2Template(items, elementHTML) {
    elementHTML.innerHTML = Object.entries(items).map(([key, item]) => createTable2Template(key, item)).join('');
}

function pastEventsStatistics(arr) {
    const statistics = arr.reduce((acc, item) => {
        const { category, price, assistance, capacity } = item;

        if (!acc[category]) {
            acc[category] = { revenues: 0, assistance: 0, capacity: 0, eventCount: 0, percentageAssistance: 0 };
        }

        acc[category].revenues += price * assistance;
        acc[category].assistance += assistance;
        acc[category].capacity += capacity;
        acc[category].eventCount += 1;

        acc[category].percentageAssistance += (assistance / capacity) * 100;

        return acc;
    }, {});

    for (let category in statistics) {
        statistics[category].percentageAssistance /= statistics[category].eventCount;
    }

    return statistics;
}

function createTable3Template(keyItem, item) {
    return `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${item.revenues.toLocaleString()}</td>
            <td>${item.percentageAssistance.toFixed(2)} %</td>
        </tr>
    `;
}

function renderTable3Template(items, elementHTML) {
    elementHTML.innerHTML = Object.entries(items).map(([key, item]) => createTable3Template(key, item)).join('');
}

async function fetchData() {
    try {
        const res = await fetch("https://aulamindhub.github.io/amazing-api/events.json");
        return await res.json();
    } catch (err) {
        console.log("Error fetching data:", err);
        throw err;
    }
}