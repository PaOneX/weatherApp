function searchWeather() {
  const cityName = document.getElementById("cityName").value.trim();

  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  const weatherResults = document.getElementById("weatherResults");
  if (weatherResults) {
    weatherResults.style.display = "none";
  }

  // Fetch weather data
  fetch(`https://api.weatherapi.com/v1/current.json?key=18c575faf6fd4df29b190236251211&q=${cityName}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("City not found! Please try another city.");
        return;
      }

      console.log("Weather Data:", data);
      
      displayWeatherData(data);
      
      fetchCountryData(data.location.country);
      
      const weatherResults = document.getElementById("weatherResults");
      if (weatherResults) {
        weatherResults.style.display = "block";
        
        setTimeout(() => {
          weatherResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      
      setBackgroundByWeather(data.current.condition.text, data.current.is_day);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      alert("Error fetching weather data! Please try again.");
    });
}

function displayWeatherData(data) {
  const setElement = (id, content) => {
    const el = document.getElementById(id);
    if (el) el.textContent = content;
  };
  
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  
  const { location, current } = data;
  
  setElement("cityName-display", location.name);
  setElement("location-details", `${location.region}, ${location.country}`);
  setElement("localTime", new Date(location.localtime).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  
  setHTML("weatherIcon", `<img src="https:${current.condition.icon}" alt="${current.condition.text}">`);
  setElement("conditionText", current.condition.text);
  setElement("temperature", `${Math.round(current.temp_c)}°C`);
  setElement("feelsLike", `${Math.round(current.feelslike_c)}°C`);
  
  setElement("windSpeed", `${current.wind_kph} km/h`);
  setElement("windDir", `${current.wind_dir} | ${current.wind_degree}°`);
  setElement("humidity", `${current.humidity}%`);
  setElement("pressure", `${current.pressure_mb} mb`);
  setElement("visibility", `${current.vis_km} km`);
  setElement("cloud", `${current.cloud}%`);
  setElement("uv", getUVLevel(current.uv));
  setElement("precip", `${current.precip_mm} mm`);
  
  const dewPoint = calculateDewPoint(current.temp_c, current.humidity);
  setElement("dewpoint", `${dewPoint}°C`);
}

function calculateDewPoint(temp, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

function getUVLevel(uv) {
  if (uv <= 2) return `${uv} - Low`;
  if (uv <= 5) return `${uv} - Moderate`;
  if (uv <= 7) return `${uv} - High`;
  if (uv <= 10) return `${uv} - Very High`;
  return `${uv} - Extreme`;
}

function fetchCountryData(countryName) {
  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(res => res.json())
    .then(data => {
      if (data && data[0]) {
        displayCountryData(data[0]);
      }
    })
    .catch(error => {
      console.error("Error fetching country data:", error);
    });
}

function displayCountryData(country) {
  const setElement = (id, content) => {
    const el = document.getElementById(id);
    if (el) el.textContent = content;
  };
  
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  
  if (country.flags && country.flags.png) {
    setHTML("countryFlag", `<img src="${country.flags.png}" alt="${country.name.common} flag">`);
  }
  
  setElement("countryName", country.name.common || "-");
  setElement("countryCapital", (country.capital && country.capital[0]) ? `Capital: ${country.capital[0]}` : "No capital information");
  
  setElement("officialName", country.name.official || "-");
  setElement("languages", country.languages ? Object.values(country.languages).join(", ") : "-");
  setElement("population", country.population ? country.population.toLocaleString() : "-");
  setElement("regionCountry", country.region || "-");
  setElement("currency", country.currencies ? Object.keys(country.currencies).join(", ") + ` (${Object.values(country.currencies)[0]?.name || ""})` : "-");
  setElement("timezoneCountry", (country.timezones && country.timezones[0]) || "-");
}

function setBackgroundByWeather(condition, isDay) {
  const conditionText = condition.toLowerCase();
  let weatherKey = "sunny";

  if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
    weatherKey = "rainy";
  } else if (conditionText.includes("cloud") || conditionText.includes("overcast") || conditionText.includes("mist") || conditionText.includes("fog")) {
    weatherKey = "cloudy";
  } else if (conditionText.includes("snow") || conditionText.includes("blizzard") || conditionText.includes("sleet")) {
    weatherKey = "snowy";
  } else if (conditionText.includes("thunder") || conditionText.includes("storm")) {
    weatherKey = "rainy"; // Fallback to rainy since stormy.mp4 doesn't exist
  } else if (conditionText.includes("clear") || conditionText.includes("sunny")) {
    weatherKey = isDay ? "sunny" : "cloudy"; // Fallback to cloudy for night
  } else if (isDay === 0) {
    weatherKey = "cloudy"; // Fallback to cloudy for night
  }

  console.log("Setting weather background:", weatherKey);
  activateVideo(weatherKey);
}

function activateVideo(weatherKey) {
  const videos = document.querySelectorAll("#bg-videos video");
  
  videos.forEach(video => {
    if (video.dataset.weather === weatherKey) {
      video.classList.add("active");
      video.play().catch(err => console.log("Video play error:", err));
    } else {
      video.classList.remove("active");
      video.pause();
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  activateVideo("sunny");
  
  document.getElementById("cityName").value = "";
  
});

document.getElementById("cityName")?.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

