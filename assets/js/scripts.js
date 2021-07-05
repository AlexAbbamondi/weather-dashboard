const apiKey = "49a9f0917eb504f38289ca76d51fb864";

const searchBtn = document.querySelector("#search-button");
var cityArray = [];

function searchValue(event) {
  event.preventDefault();
  var display = document.querySelector("#display");
  display.removeAttribute("hidden");
  var searchValue = document.querySelector("#search-value").value;
  getCurrentWeather(searchValue);

  //getForecast(searchValue);

  localStorage.setItem("city", JSON.stringify(searchValue));
  cityArray.push(JSON.parse(localStorage.getItem('city')));
  
    
  for (let i = 0; i < cityArray.length; i++) {
      var cityBtn = document.createElement("button");
      cityBtn.setAttribute("class", "city-button");
      cityBtn.textContent = cityArray[i];
      citySection.append(cityBtn);
      
  }
  
}

///////////first api to use is --- current weather data for lat + long
function getCurrentWeather(searchValue) {
//get the weather data and append it to the page
  var queryUrl ="https://api.openweathermap.org/data/2.5/weather?q=" +searchValue +"&units=imperial&appid=" +apiKey;

  //get today's date
  let today = new Date().toLocaleDateString();

  const baseClass = "fas fa-";
  const weatherKeys = {};
  weatherKeys["scattered clouds"] = baseClass + "cloud-sun";
  weatherKeys["clear sky"] = baseClass + "sun";
  weatherKeys["few clouds"] = baseClass + "cloud-sun";
  weatherKeys["broken clouds"] = baseClass + "cloud-sun";
  weatherKeys["shower rain"] = baseClass + "cloud-rain";
  weatherKeys["rain"] = baseClass + "cloud-rain";
  weatherKeys["thunderstorm"] = baseClass + "bolt";
  weatherKeys["mist"] = baseClass + "wind";

  fetch(queryUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      // Append content to dom
      var cityName = document.querySelector("#city-name");
      var temp = document.querySelector("#temp");
      var wind = document.querySelector("#wind");
      var humidity = document.querySelector("#humidity");
      var statusEl = document.createElement("span");

      cityName.innerHTML = "";
      statusEl.innerHTML = "";
      temp.innerHTML = "Temp: ";
      wind.innerHTML = "Wind: "
      humidity.innerHTML = "Humidity: ";

      statusEl.innerHTML = " " + '<i class="' +  weatherKeys[data.weather[0].description]  + '"></i>';
      
      cityName.append(data.name + " " + "(" + today + ")");
      cityName.append(statusEl);
      temp.append(data.main.temp + "\u00B0F");
      wind.append(data.wind.speed + " MPH");
      humidity.append(data.main.humidity + "%");
    });

    var geolocationQueryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchValue + "&units=imperial&appid=" + apiKey;

    fetch(geolocationQueryUrl)
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        console.log(data);
        var lon = data[0].lon;
        var lat = data[0].lat;

        var uvQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

        fetch(uvQueryUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            var uvIndex = document.querySelector("#uv-index");
            uvIndex.innerHTML = "UV Index: ";
            var uvIndexEl = document.createElement("span");
            if(data.current.uvi > 0 && data.current.uvi <= 2) {
                uvIndexEl.setAttribute("class", "uv-index-green")
            } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
                uvIndexEl.setAttribute("class", "uv-index-green")
            } else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
                uvIndexEl.setAttribute("class", "uv-index-green")
            } else {
                uvIndexEl.setAttribute("class", "uv-index-green")
            }
            uvIndexEl.append(data.current.uvi);
            uvIndex.append(uvIndexEl);
        })
    })

   
}





// function getForecast(searchValue) {
//     var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&units=imperial&appid=" + apiKey;
    
//     fetch(queryUrl)
//     .then(function(res) {
//         return res.json();
//     })
//     .then(function(data) {
//         console.log(data);

//         for (let i = 1; i < 6; i++) {
//             var forecastDiv = document.createElement("div");
//             var date = document.createElement("p");
//             var temp = document.createElement("p");
//             var wind = document.createElement("p");
//             var humidity = document.createElement("p");
//             date.append(data.list[i].dt_txt);
//             temp.append(data.list[i].main.temp);
//             wind.append(data.list[i].wind.speed);
//             humidity.append(data.list[i].main.humidity);
//             forecastDiv.append(date);
//             forecastDiv.append(temp);
//             forecastDiv.append(wind);
//             forecastDiv.append(humidity);
//         }
//     })
// }

searchBtn.addEventListener("click", searchValue);


///////       TODO: 
///////       localstorage
///////       5 day weather forecast
