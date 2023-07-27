document.addEventListener("DOMContentLoaded", function () {
  var search = document.getElementById("search_bar");
  var search_input = document.getElementById("search_input");
  var search_button = document.getElementById("search_button");
  var search_history = document.getElementById("search_history");
  var current_weather = document.getElementById("current_weather");
  var forecast = document.getElementById("forecast");
  
  var apiKey = "0e3add27fe0e1ef7bc41791be0c5f865";

  function handleSearch(event) {
    event.preventDefault();
    var city = search_input.value.trim();
    if (city === "") {
      return;
    }
  
    fetchWeatherData(city);
  }

  function fetchWeatherData(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    // Fetch the current weather data
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.cod === 200) {
          displayWeather(data);
          appendCitiesList();
          var lat = data.coord.lat;
          var lon = data.coord.lon;

          var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

          // Fetch the 5 day forecast data
          fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
              displayForecast(data);
            })
            .catch(error => {
              console.error("Error fetching forecast data:", error);
            });
        } else {
          alert("Error: " + data.message);
        }
      })
  }

    function displayWeather(data) {
      var cityName = data.name;
      var temperature = data.main.temp;
      var weatherDescription = data.weather[0].description;
      var iconCode = data.weather[0].icon;
      var temperatureCelsius = (temperature - 273.15).toFixed(1);
  
      var weatherInfoContainer = document.createElement("div");
      weatherInfoContainer.classList.add("weather-info");
  
      var cityElement = document.createElement("h2");
      cityElement.textContent = "Weather in " + cityName;
  
      var temperatureElement = document.createElement("p");
      temperatureElement.textContent = "Temperature: " + temperatureCelsius + "°C";
  
      var descriptionElement = document.createElement("p");
      descriptionElement.textContent = "Description: " + weatherDescription;
  
      var iconElement = document.createElement("img");
      iconElement.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + iconCode + ".png"
      );
      iconElement.setAttribute("alt", weatherDescription);
  
      weatherInfoContainer.appendChild(cityElement);
      weatherInfoContainer.appendChild(temperatureElement);
      weatherInfoContainer.appendChild(descriptionElement);
      weatherInfoContainer.appendChild(iconElement);
  
      current_weather.innerHTML = "";
      current_weather.appendChild(weatherInfoContainer);
    }
  
    function displayForecast(data) {
      // Process and display forecast data
    }

  search.addEventListener("submit", handleSearch);
});