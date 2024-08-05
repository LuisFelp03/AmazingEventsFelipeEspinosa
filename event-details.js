fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => response.json())
    .then(data => dataAmazing(data))
    .catch(error => console.log(error));

function dataAmazing(data) {
    let url = new URLSearchParams(window.location.search).get('id');
    let event = data.events.find(event => event._id == url);

    document.querySelector("h5").innerHTML = event.name;
    document.querySelector("p").innerHTML = event.description;
    document.getElementById("category").innerHTML = event.category;
    document.getElementById("date").innerHTML = event.date;
    document.getElementById("place").innerHTML = event.place;
    document.getElementById("capacity").innerHTML = event.capacity + " people";
    document.getElementById("assistance").innerHTML = event.assistance ? event.assistance : event.estimate + " people";
    if (event.estimate) {
        document.getElementById("Asist").innerHTML = "Estimate";
    } else {
        document.getElementById("Asist").innerHTML = "Assistance";
    }
    document.getElementById("price").innerHTML = "$" + event.price;
    document.getElementById("imagen").src = event.image;
}