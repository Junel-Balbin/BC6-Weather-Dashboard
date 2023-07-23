document.addEventListener("DOMContentLoaded", function () {
    var search = document.getElementById("search_bar");
    var search_input = document.getElementById("search_input");
    var search_button = document.getElementById("search_button");
    var search_history = document.getElementById("search_history");
    var current_weather = document.getElementById("current_weather");
    var forecast = document.getElementById("forecast");
  
    function handleSearch(event) {
      event.preventDefault();
      var city = search_input.value.trim();
      if (city === "") {
        return;
      }
  
    
      fetchWeatherData(city);
    }
  

    search.addEventListener("submit", handleSearch);
    
  });
  