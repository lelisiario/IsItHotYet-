const API_KEY = "5272f746d0a842a0ef7eccde9f807ff5";
function handleSearchBtn() {
  const city = document.querySelector("#search-city").value.trim();
  if (!city) {
    return;
  }
  fetchWeather(city);
}
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeather(data);
      const { lat, lon } = data.coord;
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          displayForecast(data);
        });
    })
    .catch((err) => console.log(err));
}
function displayWeather(data) {
  const {
    name,
    dt,
    main: {
      temp,
      humidity,
    },
    wind: {
      speed,
    },
    
    weather: [{icon, description }],
  } = data;
  const weatherEl = document.querySelector("#weather");
  weatherEl.innerHTML = `
    <h1>${name}</h1>
    <h2> ${dayjs.unix(dt).format("MM/DD/YYYY")}</h2>
    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
    <p>Temperature: ${Math.round(temp)} °F</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${speed}</p>
  `;
}
function displayForecast(data) {
const forecastEl = document.querySelector("#forecast");
forecastEl.innerHTML = ""
const { list } = data;
for (let i = 0; i < list.length; i+=8) {
const card=document.createElement("div");
const dateEl = document.createElement("h3");
const temperatureEl = document.createElement("p");
const humidityEl = document.createElement("p");
const windSpeedEl = document.createElement("p");
const iconEl = document.createElement("img");

dateEl.textContent = dayjs.unix(list[i].dt).format("MM/DD/YYYY");
humidityEl.textContent = list[i].main.humidity;
temperatureEl.textContent = Math.round(list[i].main.temp);
windSpeedEl.textContent = list[i].wind.speed;
iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png`);
iconEl.setAttribute("alt", list[i].weather[0].description);
card.append(dateEl, iconEl, temperatureEl, humidityEl, windSpeedEl,);
  forecastEl.appendChild(card);

}
}

document
  .querySelector("#search-btn")
  .addEventListener("click", handleSearchBtn);
