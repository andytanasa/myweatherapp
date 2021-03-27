function handleConversion() {
  const weatherModel = {
    temperature: document.querySelector(".temperature"),
    maxTemp: document.querySelector(".max-temp"),
    minTemp: document.querySelector(".min-temp"),
    feelLike: document.querySelector(".feels-like"),
    units: "metric",
  };
  function celsiusToFahrenheit() {
    temperatures.temperature = (temperatures.temperature * 9) / 5 + 32;
    temperatures.maxTemp = (temperatures.maxTemp * 9) / 5 + 32;
    temperatures.minTemp = (temperatures.minTemp * 9) / 5 + 32;
    temperatures.feelsLike = (temperatures.feelsLike * 9) / 5 + 32;
    return temperatures;
  }
  function fahrToCelsius() {
    temperatures.temperature = ((temperatures.temperature - 32) * 5) / 9;
    temperatures.maxTemp = ((temperatures.maxTemp - 32) * 5) / 9;
    temperatures.minTemp = ((temperatures.minTemp - 32) * 5) / 9;
    temperatures.feelsLike = ((temperatures.feelsLike - 32) * 5) / 9;
    return temperatures;
  }

  function createLayout(temperatures, weatherModel) {
    const tempIcon = weatherModel.units === "metric" ? "\u2103" : "\u2109";

    weatherModel.temperature.innerText =
      Math.floor(temperatures.temperature) + tempIcon;

    weatherModel.maxTemp.innerText = Math.ceil(temperatures.maxTemp) + tempIcon;
    weatherModel.minTemp.innerText =
      Math.floor(temperatures.minTemp) + tempIcon;

    weatherModel.feelLike.innerText =
      Math.floor(temperatures.feelsLike) + tempIcon;
  }

  let dataFromLocalStorage = getDataFromLocalStorage();

  if (dataFromLocalStorage) {
    weatherModel.userValue = dataFromLocalStorage.userValue;
    weatherModel.units = dataFromLocalStorage.units;
  }

  document.querySelector("#c-option").addEventListener("click", () => {
    const temperatures = fahrToCelsius();
    weatherModel.units = "metric";

    let dataFromLocalStorage = getDataFromLocalStorage();

    if (dataFromLocalStorage) {
      dataFromLocalStorage.units = weatherModel.units;
      setLocalStorage(dataFromLocalStorage);
    } else {
      setLocalStorage({
        userValue: weatherModel.userValue
          ? weatherModel.userValue
          : temperatures.defaultLocation,
        units: weatherModel.units,
      });
    }
    createLayout(temperatures, weatherModel);
  });
  document.querySelector("#f-option").addEventListener("click", () => {
    const temperatures = celsiusToFahrenheit();
    weatherModel.units = "imperial";
    let dataFromLocalStorage = getDataFromLocalStorage();

    if (dataFromLocalStorage) {
      dataFromLocalStorage.units = weatherModel.units;
      setLocalStorage(dataFromLocalStorage);
    } else {
      setLocalStorage({
        userValue: weatherModel.userValue
          ? weatherModel.userValue
          : temperatures.defaultLocation,
        units: weatherModel.units,
      });
    }

    createLayout(temperatures, weatherModel);
  });

  function getDataFromLocalStorage() {
    const getDataFromLocalStorage = localStorage.getItem("userPreferance");
    if (getDataFromLocalStorage) {
      return JSON.parse(getDataFromLocalStorage);
    }
    return null;
  }
  function setLocalStorage(data) {
    localStorage.setItem("userPreferance", JSON.stringify(data));
  }
}
handleConversion();
