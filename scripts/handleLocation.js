"use strict";

function handleLocation() {
  const weatherModel = {
    background: document.querySelector(".weather-app"),
    userLocation: document.querySelector(".location"),
    status: document.querySelector(".status"),
    temperature: document.querySelector(".temperature"),
    statusIcon: document.querySelector(".status-icon"),
    timeZone: document.querySelector(".time-zone"),
    maxTemp: document.querySelector(".max-temp"),
    minTemp: document.querySelector(".min-temp"),
    humidity: document.querySelector(".humidity"),
    pressure: document.querySelector(".pressure"),
    feelLike: document.querySelector(".feels-like"),
    newDate: new Date(),
    search: document.querySelector("#search"),
    time: document.querySelector(".time"),
    iconLocation: document.querySelector(".fa-map-marker-alt"),
    userValue: "Iasi",

    lat: "",
    lon: "",
    units: "metric",
  };

  weatherModel.iconLocation.addEventListener("click", () =>
    getLocation(weatherModel)
  );

  function getLocation(weatherModel) {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos, weatherModel),
      error
    );
  }
  //  function success for geolocation
  function success(pos) {
    const crd = pos.coords;
    weatherModel.lat = crd.latitude;
    weatherModel.lon = crd.longitude;
    promiseApiForIcon(weatherModel.lat, weatherModel.lon, weatherModel);
  }
  //  function error for geolocation
  function error(err) {
    console.warn("Error");
  }

  weatherModel.search.addEventListener("keydown", changeUserSearch);

  function changeUserSearch(event) {
    if (event.key === "Enter") {
      weatherModel.userValue = event.target.value;
      weatherModel.userLocation.innerText = weatherModel.userValue;
      promiseApi(weatherModel);
      clearInput(weatherModel.search);
    }
  }

  function clearInput(input) {
    return (input.value = "");
  }
  function handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Whoops");
  }
  function createLayoutInput(data, weatherModel) {
    const tempIcon = weatherModel.units === "metric" ? "\u2103" : "\u2109";

    //icon
    const iconFromApi = data.weather[0].icon;
    const icon = `http://openweathermap.org/img/wn/${iconFromApi}@2x.png`;
    weatherModel.statusIcon.innerHTML = `<img src="${icon}">`;

    //location
    weatherModel.userLocation.innerText =
      data.name + ", " + data.sys["country"];

    weatherModel.status.innerText = data.weather[0].description;
    weatherModel.temperature.innerText = Math.floor(data.main.temp) + tempIcon;

    //timezone

    weatherModel.timeZone.innerText =
      weatherModel.newDate.getDate() +
      "/ " +
      (weatherModel.newDate.getMonth() + 1) +
      "/ " +
      weatherModel.newDate.getFullYear();

    //max min temp
    weatherModel.maxTemp.innerText =
      Math.ceil(data.main["temp_max"]) + tempIcon;
    weatherModel.minTemp.innerText =
      Math.floor(data.main["temp_min"]) + tempIcon;
    // humidity
    weatherModel.humidity.innerText = data.main.humidity + "%";
    //pressure
    weatherModel.pressure.innerText = data.main.pressure + " mb";
    //feels like
    weatherModel.feelLike.innerText =
      Math.floor(data.main["feels_like"]) + tempIcon;

    //background

    switch (data.weather[0].description) {
      case "broken clouds":
      case "scattered clouds":
      case "overcast clouds":
      case "few clouds":
        weatherModel.background.style.background =
          'url("./assets/clound1.jpg")';
        weatherModel.background.style.backgroundSize = "cover";
        weatherModel.temperature.style.color = "black";
        break;
      case "clear sky":
        weatherModel.background.style.background = 'url("./assets/sun.jpg")';
        weatherModel.background.style.backgroundSize = "cover";
        weatherModel.temperature.style.color = "black";
        break;
        break;
      case "moderate rain":
      case "light rain":
      case "light snow":
      case "shower rain":
      case "rain":
      case "thunderstorm":
      case "snow":
      case "drizzle":
        weatherModel.background.style.background = 'url("./assets/rain.jpg")';
        weatherModel.background.style.backgroundSize = "cover";
        weatherModel.status.style.color = "white";
        weatherModel.statusIcon.style.color = "white";
        weatherModel.temperature.style.color = "white";
        break;
      case "fog":
      case "mist":
        weatherModel.background.style.background = 'url("./assets/fog.jpg")';
        weatherModel.background.style.color = "cover";
        weatherModel.status.style.color = "darkGray";
      default:
        return;
    }
  }
  function promiseApi(weatherModel) {
    const inputChecked = document.querySelector("input[name=selector]:checked");
    weatherModel.units = inputChecked.value;
    setLocalStorage({
      userValue: weatherModel.userValue,
      units: inputChecked.value,
    });
    const apiKey = "173f63dec6e7aa62a2b05761efc26384";
    const base = `https://api.openweathermap.org/data/2.5/weather?q=${weatherModel.userValue}&units=${inputChecked.value}&appid=`;
    fetch(`${base}${apiKey}`)
      .then(handleResponse)
      .then((data) => {
        temperatures.temperature = data.main.temp;
        temperatures.maxTemp = data.main.temp_max;
        temperatures.minTemp = data.main.temp_min;
        temperatures.feelsLike = data.main.feels_like;
        createLayoutInput(data, weatherModel);
      })
      .catch((error) => {
        weatherModel.userLocation.innerText = "No valid location";
        weatherModel.status.innerText = "Please enter your location";
        weatherModel.statusIcon.innerText = "-";
        weatherModel.temperature.innerText = "";
        weatherModel.timeZone.innerText = "";
        weatherModel.maxTemp.innerText = "";
        weatherModel.minTemp.innerText = "";
        weatherModel.humidity.innerText = "";
        weatherModel.feelLike.innerText = "";
        console.log(error);
      });

    // display time at top
    function updateTime() {
      let minutes = weatherModel.newDate.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      } else {
        minutes = "" + minutes;
      }
      weatherModel.time.innerText =
        weatherModel.newDate.getHours() + ":" + minutes;
    }
    updateTime();
  }
  function promiseApiForIcon(lat, lon, weatherModel) {
    const inputChecked = document.querySelector("input[name=selector]:checked");
    weatherModel.units = inputChecked.value;

    const apiKey = "173f63dec6e7aa62a2b05761efc26384";
    const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${inputChecked.value}&appid=`;
    fetch(`${base}${apiKey}`)
      .then(handleResponse)
      .then((data) => {
        temperatures.temperature = data.main.temp;
        temperatures.maxTemp = data.main.temp_max;
        temperatures.minTemp = data.main.temp_min;
        temperatures.feelsLike = data.main.feels_like;
        console.log(data);
        setLocalStorage({
          userValue: data.name,
          units: inputChecked.value,
        });
        createLayoutInput(data, weatherModel);
      })
      .catch((error) => {
        weatherModel.userLocation.innerText = "No valid location";
        weatherModel.status.innerText = "Please enter your location";
        weatherModel.statusIcon.innerText = "-";
        weatherModel.temperature.innerText = "";
        weatherModel.timeZone.innerText = "";
        weatherModel.maxTemp.innerText = "";
        weatherModel.minTemp.innerText = "";
        weatherModel.humidity.innerText = "";
        weatherModel.feelLike.innerText = "";
        console.log(error);
      });
  }
  // set localstorage
  function setLocalStorage(data) {
    localStorage.setItem("userPreferance", JSON.stringify(data));
  }
}
handleLocation();
