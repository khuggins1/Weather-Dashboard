/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const begin  = document.querySelector(".headline form");
const data = document.querySelector(".headline input");
const language = document.querySelector(".headline .report");
const choices = document.querySelector(".weather .places");
const apiKey = "00853f1e6bb3f3004140de64ac08e7c7";

begin.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = data.value;

  //check if there's already a city
  const options = choices.querySelectorAll(".weather .city");
  const possibilities  = Array.from(options);

  if (possibilities.length > 0) {
    const filteredArray = possibilities.filter(el => {
      let content = "";
      
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
      language.textContent = `You already entered the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...please be more specific`;
      begin.reset();
      data.focus();
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
      choices.appendChild(li);
    })
    .catch(() => {
      language.textContent = "Please check spelling of the city";
    });

  language.textContent = "";
  begin.reset();
  data.focus();
});

// five day weather //