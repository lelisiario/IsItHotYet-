const API_KEY = "5272f746d0a842a0ef7eccde9f807ff5";
// Function to handle form submission when searching for a city
function handleSearchBtn() {
  // Extract the city value from the input field
  const city = document.querySelector("#search-city").value.trim();
  if (!city) {
    return; // No action if the input is empty
  }
  fetchWeather(city); // Fetch weather data for the entered city
}

// Function to fetch weather data for the specified city
function fetchWeather(city) {
  // Construct the URL for fetching weather data using the OpenWeatherMap API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

  // Fetch current weather data
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the received data
      displayWeather(data); // Display current weather conditions
      const { lat, lon } = data.coord;
      // Fetch forecast data using latitude and longitude
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the received forecast data
          displayForecast(data); // Display forecast for the next 5 days
        });
    })
    .catch((err) => console.log(err)); // Error handling for fetch requests
}

// Function to display current weather conditions
function displayWeather(data) {
  // Extract relevant data from the response object
  const {
    name,
    dt,
    main: { temp, humidity },
    wind: { speed },
    weather: [{ icon, description }],
  } = data;

  // Display current weather conditions on the webpage
  const weatherEl = document.querySelector("#weather");
  weatherEl.innerHTML = `
    <h3>${name}</h3>
    <h3>${dayjs.unix(dt).format("MM/DD/YYYY")}</h3>
    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
    <p>Temperature: ${Math.round(temp)} °F</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${speed}</p>
  `;
}

// Function to display forecast for the next 5 days
function displayForecast(data) {
  // Extract forecast data from the response object
  const { list } = data;
  const forecastEl = document.querySelector("#forecast");
  forecastEl.innerHTML = ""; // Clear previous forecast content

  // Loop through the forecast data and display each day's weather information
  for (let i = 0; i < list.length; i += 8) {
    const card = document.createElement("div");
    const dateEl = document.createElement("h3");
    const temperatureEl = document.createElement("p");
    const humidityEl = document.createElement("p");
    const windSpeedEl = document.createElement("p");
    const iconEl = document.createElement("img");

    // Populate elements with forecast data
    dateEl.textContent = dayjs.unix(list[i].dt).format("MM/DD/YYYY");
    humidityEl.textContent = list[i].main.humidity;
    temperatureEl.textContent = Math.round(list[i].main.temp);
    windSpeedEl.textContent = list[i].wind.speed;
    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png`);
    iconEl.setAttribute("alt", list[i].weather[0].description);

    // Append elements to the forecast card and then to the forecast container
    card.append(dateEl, iconEl, temperatureEl, humidityEl, windSpeedEl);
    forecastEl.appendChild(card);
  }
}

// Event listener for the search button
document.querySelector("#search-btn").addEventListener("click", handleSearchBtn);

document.querySelector("#search-city").addEventListener("keypress", function(event) {
  // Check if the pressed key is "Enter" (keycode 13)
  if (event.key === "Enter") {
    // Prevent the default action of the "Enter" key (form submission)
    event.preventDefault();
    // Call the function to handle form submission
    handleSearchBtn();
  }
});