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
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Fetch the current weather data
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {

      })
      .catch(error => {
        console.error("Error fetching current weather data:", error);
      });


    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch the 5 day forecast data
    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {

      })
      .catch(error => {

        console.error("Error fetching forecast data:", error);
      });



  function updateWeatherUI(data) {

      }

  }

  search.addEventListener("submit", handleSearch);
});
