const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

import apiKey from './config';

const getWeatherInfo = (cityName, lat, lon) => {
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherApiUrl).then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(() => {
        alert("An error occurred while fetching weather data.")
    })

}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

fetch(geoApiUrl).then(response => response.json())
.then(data => {
    if(!data.length) return alert(`Coordinates for ${cityName} not found`);
    const { name, lat, lon } = data[0];
    getWeatherInfo(name, lat, lon);
})
.catch(() => {
    alert("An error occurred while fetching coordinates.")
})

}

searchButton.addEventListener("click", getCityCoordinates);
