
/* ====== Weather Information ====== */

const apiKey = "1e52f30fce127c1f22c5b1a5a8b0882b";

// Provo, Utah coordinates.
const latitude = 40.2338;
const longitude = -111.6585;

// OpenWeatherMap API URLs.
const currentWeatherURL =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;


/* ====== Current Weather ====== */

async function getCurrentWeather() {
    const weatherContainer = document.querySelector("#current-weather-info");

    try {
        const response = await fetch(currentWeatherURL);

        if (!response.ok) {
            throw new Error("Unable to retrieve current weather.");
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        weatherContainer.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
                 alt="${description}">
            <p><strong>${temperature}°F</strong></p>
            <p>${description}</p>
            <p>Feels like ${Math.round(data.main.feels_like)}°F</p>
        `;

    } catch (error) {
        console.error("Error loading current weather:", error);
        weatherContainer.textContent =
            "Unable to load current weather.";
    }
}


/* ====== Three-Day Forecast ====== */

async function getForecast() {
    const forecastContainer = document.querySelector("#forecast-container");

    try {
        const response = await fetch(forecastURL);

        if (!response.ok) {
            throw new Error("Unable to retrieve forecast.");
        }

        const data = await response.json();

        // Group forecast entries by their local calendar date.
        const dailyForecasts = {};

        data.list.forEach(item => {
            const localDate = new Date(
                (item.dt + data.city.timezone) * 1000
            );

            const date = localDate.toISOString().split("T")[0];

            if (!dailyForecasts[date]) {
                dailyForecasts[date] = [];
            }

            dailyForecasts[date].push({
                item: item,
                hour: localDate.getUTCHours()
            });
        });

        // Choose the forecast closest to noon for each day.
        const selectedDays = Object.entries(dailyForecasts)
            .slice(0, 3)
            .map(([date, forecasts]) => {
                return forecasts.reduce((closest, current) => {
                    return Math.abs(current.hour - 12) <
                        Math.abs(closest.hour - 12)
                        ? current
                        : closest;
                });
            });

        forecastContainer.innerHTML = "";

        selectedDays.forEach(day => {
            const forecast = day.item;
            const date = new Date(
                (forecast.dt + data.city.timezone) * 1000
            );

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC"
            });

            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const icon = forecast.weather[0].icon;

            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-day");

            forecastCard.innerHTML = `
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}.png"
                     alt="${description}">
                <p><strong>${temperature}°F</strong></p>
                <p>${description}</p>
            `;

            forecastContainer.appendChild(forecastCard);
        });

    } catch (error) {
        console.error("Error loading forecast:", error);
        forecastContainer.textContent =
            "Unable to load the forecast.";
    }
}


/* ====== Load Weather ====== */

getCurrentWeather();
getForecast();
