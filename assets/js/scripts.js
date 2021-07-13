//api key
const apiKey = "49a9f0917eb504f38289ca76d51fb864";

//search button selector
const searchBtn = document.querySelector("#search-button");

//dictionary for weather icons
const baseClass = "fas fa-";
const weatherKeys = {};
weatherKeys["clouds"] = baseClass + "cloud-sun";
weatherKeys["clear"] = baseClass + "sun";
weatherKeys["snow"] = baseClass + "snowflake";
weatherKeys["drizzle"] = baseClass + "cloud-sun-rain";
weatherKeys["rain"] = baseClass + "cloud-rain";
weatherKeys["thunderstorm"] = baseClass + "bolt";

//get today's date
var today = new Date().toLocaleDateString();

//function to get the value that is in the input inorder to get the current weather
function getSearchValue(event) {
  event.preventDefault();
  var display = document.querySelector("#display");
  display.removeAttribute("hidden");
  var searchValue = document.querySelector("#search-value").value;
  getCurrentWeather(searchValue);
  getLocalStorage(searchValue);
}

//implements localstorage and displays what is stored as buttons on the page
function getLocalStorage(searchValue) {
  //Localstorage -- created an array to store all the input values in ---- create buttons with said input values
  var cityArray = [];
  localStorage.setItem("city", JSON.stringify(searchValue));
  cityArray.push(JSON.parse(localStorage.getItem("city")));

  for (let i = 0; i < cityArray.length; i++) {
    var cityBtn = document.createElement("button");
    cityBtn.setAttribute("class", "city-button");

    cityBtn.setAttribute("id", "cityButton");
    var cityButton = document.querySelector("#cityButton");

    cityBtn.textContent = cityArray[i];
    citySection.append(cityBtn);
  }

  searchValue = document.querySelector("#cityButton").value;
  
  cityButton.addEventListener("click", function() {
    getCurrentWeather(searchValue);
  });


}

//function to get the current weather and all conditions
function getCurrentWeather(searchValue) {
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    apiKey;

  fetch(queryUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      // Query Selectors and span created
      var cityName = document.querySelector("#city-name");
      var temp = document.querySelector("#temp");
      var wind = document.querySelector("#wind");
      var humidity = document.querySelector("#humidity");
      var statusEl = document.createElement("span");

      //Created to use for eather conditions based off dictionary
      var descriptionKey = data.weather[0].main.toLowerCase();
      var descriptionValueClass = weatherKeys[descriptionKey];

      //set the inital values of the current weather display
      cityName.innerHTML = "";
      statusEl.innerHTML = "";
      temp.innerHTML = "Temp: ";
      wind.innerHTML = "Wind: ";
      humidity.innerHTML = "Humidity: ";

      statusEl.innerHTML =
        " " + '<i class="' + descriptionValueClass + '"></i>';

      //Append current weather data to the page
      cityName.append(data.name + " " + "(" + today + ")");
      cityName.append(statusEl);
      temp.append(data.main.temp + "\u00B0F");
      wind.append(data.wind.speed + " MPH");
      humidity.append(data.main.humidity + "%");
    });

  //Send the search value to the getUVIndex function
  getUvIndex(searchValue);
}

//Get the uv index for the current day in the selected city
function getUvIndex(searchValue) {
  //Get the lon and lat of a city from the input
  var geolocationQueryUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    searchValue +
    "&units=imperial&appid=" +
    apiKey;

  fetch(geolocationQueryUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      var lon = data[0].lon;
      var lat = data[0].lat;

      //pass lat and lon to getForecast function
      getForecast(lon, lat);

      var uvQueryUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        apiKey;

      fetch(uvQueryUrl)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          console.log(data);

          //set the uvindex initially to empty them append it to text with the appropriate color code
          var uvIndex = document.querySelector("#uv-index");
          uvIndex.innerHTML = "UV Index: ";
          var uvIndexEl = document.createElement("span");
          if (data.current.uvi > 0 && data.current.uvi <= 2) {
            uvIndexEl.setAttribute("class", "uv-index-green");
          } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
            uvIndexEl.setAttribute("class", "uv-index-yellow");
          } else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
            uvIndexEl.setAttribute("class", "uv-index-orange");
          } else {
            uvIndexEl.setAttribute("class", "uv-index-red");
          }
          uvIndexEl.append(data.current.uvi);
          uvIndex.append(uvIndexEl);
        });
    });
}

//function to get the 5 day forecast
function getForecast(lon, lat) {
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    apiKey;

  //get current date
  var currDate = new Date();

  fetch(queryUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      //set parentDiv initally to empty so that the forecast will only show 5 divs at one time
      var parentDiv = document.querySelector("#forecast");
      parentDiv.innerHTML = "";

      //for loop to create the 5 divs for the 5 day forcast with the appropriate data
      for (let i = 1; i < 6; i++) {
        //create elements and set classes
        var forecastDiv = document.createElement("div");
        forecastDiv.classList = "col-sm-12 m-2 col-md-2 bg-dark text-white";
        var forecastDate = document.createElement("p");
        var temp = document.createElement("p");
        temp.classList = "mt-3";
        var wind = document.createElement("p");
        var icon = document.createElement("i");
        var humidity = document.createElement("p");
        var descriptionKey = data.daily[i].weather[0].main.toLowerCase();
        var descriptionValueClass = weatherKeys[descriptionKey];

        //set the dates for the 5 day forecast
        var dd = currDate.getDate() + 1;
        var mm = currDate.getMonth() + 1;
        var yyyy = currDate.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }

        var fDate = mm + "/" + dd + "/" + yyyy;
        currDate.setDate(currDate.getDate() + 1);

        //append forcast to page
        forecastDate.append(fDate);
        icon.innerHTML = '<i class="' + descriptionValueClass + '"></i>';
        temp.append("Temp: " + data.daily[i].temp.day + "\u00B0F");
        wind.append("Wind: " + data.daily[i].wind_speed + " MPH");
        humidity.append("Humidity: " + data.daily[i].humidity + "%");
        forecastDiv.append(forecastDate);
        forecastDiv.append(icon);
        forecastDiv.append(temp);
        forecastDiv.append(wind);
        forecastDiv.append(humidity);
        parentDiv.append(forecastDiv);
      }
    });
}

//click event on search button
searchBtn.addEventListener("click", getSearchValue);
