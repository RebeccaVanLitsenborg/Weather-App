const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector("#sidebar");

import apiKey from './config.js';

// Selecting all sections with their unique id's
const sectionCards = document.querySelectorAll('#dayone, #daytwo, #daythree, #dayfour, #dayfive, #daysix');

const createWeatherCard = (weatherItem) => {
    const date = weatherItem.dt_txt.split(" ")[0];
    return `<div class="weathercard">
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
        <h4>Temp:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind:${weatherItem.wind.speed}m/s</h4>
        <h4>Humidity:${weatherItem.main.humidity}%</h4>
    </div>`;
};

const createMainWeatherInfo = (weatherItem, cityName) => {
    return `<p class="today-date">${weatherItem.dt_txt.split(" ")[0]}</p>
            <div class="search">
                <input class="city-input" type ="text" placeholder="Enter City Name">
                <button class ="search-btn"><img src="./images/searchicon.png" alt="#"></button>
            </div>
            <div class="weather">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
                <h1 class="city-name">${cityName}</h1>
                <h2 class="temp">${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h2>
                <div class="wind-humidity">
                    <div class="col">
                        <img src="./images/humidity.png">
                        <div>
                            <p class="humidity">${weatherItem.main.humidity}%</p>
                            <p>Humidity</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="./images/wind.png">
                        <div>
                            <p class="wind">${weatherItem.wind.speed}m/s</p>
                            <p>Wind Speed</p>
                        </div>
                    </div>
                </div>
            </div>`;
}

const getWeatherInfo = (cityName, lat, lon) => {
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weather Data:', data);

            // Display the current weather in the main aside element
            currentWeatherDiv.innerHTML = createMainWeatherInfo(data.list[0], cityName);

            // Loop through each section and insert the corresponding weather card
            for (let i = 0; i < 6; i++) {
                sectionCards[i].innerHTML = createWeatherCard(data.list[i * 7 + 1]);
            }
        })
        .catch(() => {
            alert("An error occurred while fetching weather data.")
        });
}


const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(geoApiUrl);
        const data = await response.json();

        if (!data.length) {
            return alert(`Coordinates for ${cityName} not found`);
        }

        const { name, lat, lon } = data[0];
        getWeatherInfo(name, lat, lon);
    } catch (error) {
        alert("An error occurred while fetching coordinates.");
    }
}

searchButton.addEventListener("click", getCityCoordinates);