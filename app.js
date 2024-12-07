window.onload = function () {
    getWeatherByLocation();
};

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '40bf9f24ae3509f909c532dbf3951b81'; // Replace with your API key

            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                // Fetch current weather
                const weatherResponse = await fetch(weatherURL);
                if (!weatherResponse.ok) throw new Error('Failed to fetch current weather');
                const weatherData = await weatherResponse.json();
                displayWeather(weatherData);
                otherInfo(weatherData);

                
                const forecastResponse = await fetch(forecastURL);
                if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
                const forecastData = await forecastResponse.json();
                displayForecast(forecastData);
            } catch (error) {
                showError(error.message);
            }
        }, (error) => {
            showError('Unable to retrieve location. Please allow location access.');
        });
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

function showError(message) {
    document.getElementById('weather-info').innerHTML = `<p>${message}</p>`;
}




async function getWeather() {
    const city = document.getElementById('searchKey').value;
    const apiKey = '40bf9f24ae3509f909c532dbf3951b81'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
        otherInfo(data)
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>${error.message}</p>`;
    }
    const forecastURL =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(forecastURL);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>${error.message}</p>`;
    }
    
}
function formatDate(date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const dayName = daysOfWeek[date.getDay()]; // Get the day of the week
    const day = date.getDate();               // Get the day of the month
    const month = months[date.getMonth()];    // Get the month
    const year = date.getFullYear();          // Get the year
    
    return `${dayName}, ${day} ${month} ${year}`;
}


function displayWeather(data) {
    const today = new Date();
    console.log(formatDate(today))
    const weatherInfo = `<div class="tempIcon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                        </div>
                        <div class="temp">
                            <h1>${Math.round(data.main.temp)}</h1>
                        <p>&deg;c</p>
                        </div>
                        <div class="weatherDescription"> 
                            <p>${data.weather[0].description}</p>
                        </div>`;
    document.getElementById('crTemp').innerHTML = weatherInfo;
    document.getElementById('loc').innerHTML =`<h2>${data.name}<span style="font-size: 15px;">,  ${data.sys.country}</span></h2>`;
    document.getElementById('date').innerHTML =` <p>${formatDate(today)}`;
}
function otherInfo(data){
    const info = `<div>
                    <p>humidity: ${data.main.humidity}</p>
                </div>
                <div>
                    <p>wind speed: ${data.wind.speed}</p>
                </div>
                <div>
                    <p>pressure: ${data.main.pressure}</p>
                </div>
                <div>
                    <p>visibility: ${data.visibility}</p>
                </div>`
    
    document.getElementById('otherinfo').innerHTML = info;
    
}


function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Group data by day
    const dailyForecast = {};
    data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0]; // Extract date (YYYY-MM-DD)
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    // Display summarized forecast for each day
    Object.keys(dailyForecast).slice(0, 5).forEach((date) => {
        const dayData = dailyForecast[date];
        const temperatures = dayData.map(item => item.main.temp);
        const icons = dayData.map(item => item.weather[0].icon);

        // Calculate daily averages
        const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);
        const mostCommonIcon = icons[0]; // Use the first icon (or determine the most common)

        // Format and display
        const forecastHTML = `
            <div class="day">
                <p>${formatDay(new Date(date))}</p>
                <img src="https://openweathermap.org/img/wn/${mostCommonIcon}.png" alt="Weather Icon">
                <div class="forecastTemp">
                    <h4>${Math.round(avgTemp)}<sup>&deg;c</sup></h4>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += forecastHTML;
    });
}


function formatDay(date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
}

