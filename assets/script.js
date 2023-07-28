document.addEventListener("DOMContentLoaded", function () {
  var search = document.getElementById("search_bar");
  var search_input = document.getElementById("search_input");
  var search_button = document.getElementById("search_button");
  var search_history = document.getElementById("search_history");
  var current_weather = document.getElementById("current_weather");
  var forecast = document.getElementById("forecast");
  var recentSearches = JSON.parse(localStorage.getItem("recents")) || [];


  var apiKey = "0e3add27fe0e1ef7bc41791be0c5f865";

  function handleSearch(event) {
    event.preventDefault();
    var city = search_input.value.trim();
    if (city === "") {
      return;
    }

    fetchWeatherData(city);
  }

  function setLocalStorage(city) {
    if (recentSearches.indexOf(city) === -1) {
      recentSearches.push(city);
      localStorage.setItem("recents", JSON.stringify(recentSearches));
    }
  }

  function appendCitiesList() {
    search_history.innerHTML = "";
    for (var i = recentSearches.length - 1; i >= 0; i--) {
      var city = recentSearches[i];
      var listItem = document.createElement("li");
      listItem.textContent = city;
  
      listItem.addEventListener("click", function (event) {
        var clickedCity = event.target.textContent;
        fetchWeatherData(clickedCity);
      });
  
      search_history.appendChild(listItem);
    }
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
          setLocalStorage(city);
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
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var temperatureFahrenheit = ((temperature * 9/5) - 459.67).toFixed(1);
  
    var weatherInfoContainer = document.createElement("div");
    weatherInfoContainer.classList.add("weather-info");
  
    var cityElement = document.createElement("h2");
    cityElement.textContent = cityName;
  
    var dateElement = document.createElement("p");
    var currentDate = new Date();
    dateElement.textContent = currentDate.toLocaleDateString();
  
    var temperatureElement = document.createElement("p");
    temperatureElement.textContent = "Temperature: " + temperatureFahrenheit + "°F";
  
    var humidityElement = document.createElement("p");
    humidityElement.textContent = "Humidity: " + humidity + "%";
  
    var windSpeedElement = document.createElement("p");
    windSpeedElement.textContent = "Wind Speed: " + windSpeed + " m/s";
  
    var descriptionElement = document.createElement("p");
    descriptionElement.textContent = "Description: " + weatherDescription;
  
    var iconElement = document.createElement("img");
    iconElement.setAttribute(
      "src",
      "https://openweathermap.org/img/w/" + iconCode + ".png"
    );
    iconElement.setAttribute("alt", weatherDescription);
  
    weatherInfoContainer.appendChild(cityElement);
    weatherInfoContainer.appendChild(dateElement);
    weatherInfoContainer.appendChild(temperatureElement);
    weatherInfoContainer.appendChild(humidityElement);
    weatherInfoContainer.appendChild(windSpeedElement);
    weatherInfoContainer.appendChild(descriptionElement);
    weatherInfoContainer.appendChild(iconElement);
  
    current_weather.innerHTML = "";
    current_weather.appendChild(weatherInfoContainer);
  }
  
  function displayForecast(data) {
  }

  search_button.addEventListener("click", handleSearch);
  search.addEventListener("submit", handleSearch);
});