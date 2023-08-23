document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  var search = document.getElementById("search_bar");
  var search_input = document.getElementById("search_input");
  var search_button = document.getElementById("search_button");
  var search_history = document.getElementById("search_history");
  var current_weather = document.getElementById("current_weather");
  var forecast = document.getElementById("forecast");

  // Retrieves recent searches from local storage
  var recentSearches = JSON.parse(localStorage.getItem("recents")) || [];

  // API key for OpenWeatherMap API
  var apiKey = "";

  // Function to handle the search form submission
  function handleSearch(event) {
    event.preventDefault();
    var city = search_input.value.trim();
    if (city === "") {
      return;
    }

    // Fetch weather data for the entered city
    fetchWeatherData(city);
  }

  // Function to add the searched city to local storage
  function setLocalStorage(city) {
    if (recentSearches.indexOf(city) === -1) {
      recentSearches.push(city);
      localStorage.setItem("recents", JSON.stringify(recentSearches));
    }
  }

  // Function to append the list of recent cities to the search history
  function appendCitiesList() {
    search_history.innerHTML = "";
    for (var i = recentSearches.length - 1; i >= 0; i--) {
      var city = recentSearches[i];
      var listItem = document.createElement("li");
      listItem.textContent = city;

      // Click event listener to the city list item to fetch weather data
      listItem.addEventListener("click", function (event) {
        var clickedCity = event.target.textContent;
        fetchWeatherData(clickedCity);
      });

      search_history.appendChild(listItem);
    }
  }

  // Clear button element
  var clearButton = document.getElementById("clear_button");

  // Click event listener to the clear button to remove recent searches from local storage
  clearButton.addEventListener("click", function () {
    localStorage.removeItem("recents");
    recentSearches = [];
    appendCitiesList();
  });

  // Function to fetch weather data from the OpenWeatherMap API
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
      });
  }

  // Function to display the current weather data
  function displayWeather(data) {
    var cityName = data.name;
    var temperature = data.main.temp;
    var weatherDescription = data.weather[0].description;
    var iconCode = data.weather[0].icon;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var temperatureFahrenheit = ((temperature * 9/5) - 459.67).toFixed(1);

    // Creates elements to display weather information
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

    // Append weather information elements to the container
    weatherInfoContainer.appendChild(cityElement);
    weatherInfoContainer.appendChild(dateElement);
    weatherInfoContainer.appendChild(temperatureElement);
    weatherInfoContainer.appendChild(humidityElement);
    weatherInfoContainer.appendChild(windSpeedElement);
    weatherInfoContainer.appendChild(descriptionElement);
    weatherInfoContainer.appendChild(iconElement);

    // Update the current weather container
    current_weather.innerHTML = "";
    current_weather.appendChild(weatherInfoContainer);
  }

  // Function to display the 5 day forecast
  function displayForecast(data) {
    forecast.innerHTML = "";

    var forecastItems = data.list;
    var uniqueDates = [];

    for (var i = 0; i < forecastItems.length; i++) {
      var forecastData = forecastItems[i];
      var timestamp = forecastData.dt * 1000;
      var dateTime = dayjs(timestamp);
      var dateKey = dateTime.format("YYYY-MM-DD");

      if (uniqueDates.includes(dateKey)) {
        continue;
      }

      uniqueDates.push(dateKey);

      var temperature = forecastData.main.temp;
      var weatherDescription = forecastData.weather[0].description;
      var iconCode = forecastData.weather[0].icon;
      var humidity = forecastData.main.humidity;
      var windSpeed = forecastData.wind.speed;
      var temperatureFahrenheit = ((temperature * 9 / 5) - 459.67).toFixed(1);

      var forecastItemContainer = document.createElement("div");
      forecastItemContainer.classList.add("forecast-item");

      var dateElement = document.createElement("p");
      dateElement.textContent = dateTime.format("ddd, MMM D");

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

      // Append forecast item elements to the container
      forecastItemContainer.appendChild(dateElement);
      forecastItemContainer.appendChild(temperatureElement);
      forecastItemContainer.appendChild(humidityElement);
      forecastItemContainer.appendChild(windSpeedElement);
      forecastItemContainer.appendChild(descriptionElement);
      forecastItemContainer.appendChild(iconElement);

      // Update the forecast container
      forecast.appendChild(forecastItemContainer);

      // Show only 5 forecast items
      if (uniqueDates.length === 5) {
        break;
      }
    }
    // Shows the weather card container
    document.getElementById("weather_card").style.display = "block";
  }

  // Event listeners to the search button and search form
  search_button.addEventListener("click", handleSearch);
  search.addEventListener("submit", handleSearch);
});