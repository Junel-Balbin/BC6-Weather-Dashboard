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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e3add27fe0e1ef7bc41791be0c5f865"

    // Fetch the current weather data
    fetch(apiUrl)
        // request was successful
        .then(function(response) {
          return response.json();
        }).then(function (data) {
          if (response.ok) {
          response.json().then(function(data) {
              displayWeather(data);
              appendCitiesList();
              var lat = data.coord.lat;
              var lon = data.coord.lon;
              getCurrentWeather(lat, lon);
              getNextWeather(lat, lon);
          });
      // Error request
      } else {
          alert("Error: " + response.statusText);
      }
  })  
      .catch(function(error) {
        alert("Unable to fetch current weather data:");
      });


    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + lat + "&lon=" + lon + "&appid=0e3add27fe0e1ef7bc41791be0c5f865"

    // Fetch the 5 day forecast data
    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {

      })
      .catch(error => {
        console.error("Error fetching forecast data:", error);
      });

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
  

  search.addEventListener("submit", handleSearch);
});