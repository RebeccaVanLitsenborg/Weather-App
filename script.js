const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

// Selecting all sections with their unique id's
const sectionCards = document.querySelectorAll('#dayone, #daytwo, #daythree, #dayfour, #dayfive, #daysix');

import apiKey from './config.js';

const createWeatherCard = (weatherItem) => {
    return `<div class="weathercard">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                <h4>Temp:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind:${weatherItem.wind.speed}m/s</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </div>`;
}

const getWeatherInfo = (cityName, lat, lon) => {
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDays = [];
            const fiveDayForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!forecastDays.includes(forecastDate)) {
                    return forecastDays.push(forecastDate);
                }
            });

            cityInput.value = "";

            // Loop through each section and insert the corresponding weather card
            sectionCards.forEach((section, index) => {
                section.innerHTML = createWeatherCard(fiveDayForecast[index]);
            });
        })
        .catch(() => {
            alert("An error occurred while fetching weather data.")
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`Coordinates for ${cityName} not found`);
            const { name, lat, lon } = data[0];
            getWeatherInfo(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching coordinates.")
        });
}

searchButton.addEventListener("click", getCityCoordinates);
