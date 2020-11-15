/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "00853f1e6bb3f3004140de64ac08e7c7";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax should go here?
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

// five day weather //

const CURRENT_LOCATION = document.getElementsByClassName('weather-content__overview')[0];
const CURRENT_TEMP = document.getElementsByClassName('weather-content__temp')[0];
const FORECAST = document.getElementsByClassName('component__forecast-box')[0];

const URL = "https://api.openweathermap.org/data/2.5/forecast/daily?" +
"q=CITY&cnt=7&units=imperial&APPID=00853f1e6bb3f3004140de64ac08e7c7";

function getWeatherData() {
    let headers = new Headers();
  
    return fetch(URL, {
      method: 'GET',
      headers: headers
    }).then(data => {
      return data.json();
    });
  }
  getWeatherData().then(weatherData => {
    let city = weatherData.city.name;
    let dailyForecast = weatherData.list;
  
    renderData(city, dailyForecast);
  });
  renderData = (location, forecast) => {
    const currentWeather = forecast[0].weather[0];
    const widgetHeader =
    `<h1>${location}</h1><small>${currentWeather.description}</small>`;
  
    CURRENT_TEMP.innerHTML =
    `<i class="wi ${applyIcon(currentWeather.icon)}"></i>
    ${Math.round(forecast[0].temp.day)} <i class="wi wi-degrees"></i>`;
  
    CURRENT_LOCATION.innerHTML = widgetHeader;
  
    // render each daily forecast
    forecast.forEach(day => {
      let date = new Date(day.dt * 1000);
      let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
      let name = days[date.getDay()];
      let dayBlock = document.createElement("div");
      dayBlock.className = 'forecast__item';
      dayBlock.innerHTML =
        `<div class="forecast-item__heading">${name}</div>
        <div class="forecast-item__info">
        <i class="wi ${applyIcon(day.weather[0].icon)}"></i>
        <span class="degrees">${Math.round(day.temp.day)}
        <i class="wi wi-degrees"></i></span></div>`;
      FORECAST.appendChild(dayBlock);
    });
  }
  