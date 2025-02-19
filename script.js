document.getElementById('pv-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const address = document.getElementById('address').value;
    const postalCode = document.getElementById('postalCode').value;
    const city = document.getElementById('city').value;

    // Appel à l'API PVGIS (utilisation d'un proxy pour contourner CORS)
    fetchPVGISData(address, postalCode, city)
        .then(data => {
            displayResults(name, surname, data);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données PVGIS:", error);
        });
});

function fetchPVGISData(address, postalCode, city) {
    // Utilisation d'un proxy pour contourner CORS
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://re.jrc.ec.europa.eu/api/PVcalc?lat=48.8566&lon=2.3522&peakpower=1&loss=14`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Traiter les données de l'API
            return {
                irradiance: data.outputs.totals.fixed.E_y,
                latitude: 48.8566,
                longitude: 2.3522,
            };
        })
        .catch(error => {
            throw new Error("Failed to fetch data from PVGIS API");
        });
}

function displayResults(name, surname, data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Résultats pour ${name} ${surname}</h2>
        <p>Ensoleillement : ${data.irradiance} kWh/m²/jour</p>
        <p>Latitude : ${data.latitude}, Longitude : ${data.longitude}</p>
    `;
}
