// Search Weather Function
function searchWeather() {
  const cityName = document.getElementById("cityName").value.trim();

  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  // Show loading state (check if element exists)
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
      
      // Display all weather data
      displayWeatherData(data);
      
      // Fetch country data
      fetchCountryData(data.location.country);
      
      // Show results (check if element exists)
      const weatherResults = document.getElementById("weatherResults");
      if (weatherResults) {
        weatherResults.style.display = "block";
        
        // Smooth scroll to results
        setTimeout(() => {
          weatherResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      
      // Set background by weather condition
      setBackgroundByWeather(data.current.condition.text, data.current.is_day);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      alert("Error fetching weather data! Please try again.");
    });
}

// Display All Weather Data
function displayWeatherData(data) {
  conHelper function to safely set element content
  const setElement = (id, content) => {
    const el = document.getElementById(id);
    if (el) el.textContent = content;
  };
  
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  
  // Location Information
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
  
  // Main Weather
  setHTML("weatherIcon", `<img src="https:${current.condition.icon}" alt="${current.condition.text}">`);
  setElement("conditionText", current.condition.text);
  setElement("temperature", `${Math.round(current.temp_c)}°C`);
  setElement("feelsLike", `${Math.round(current.feelslike_c)}°C`);
  
  // Weather Details
  setElement("windSpeed", `${current.wind_kph} km/h`);
  setElement("windDir", `${current.wind_dir} | ${current.wind_degree}°`);
  setElement("humidity", `${current.humidity}%`);
  setElement("pressure", `${current.pressure_mb} mb`);
  setElement("visibility", `${current.vis_km} km`);
  setElement("cloud", `${current.cloud}%`);
  setElement("uv", getUVLevel(current.uv));
  setElement("precip", `${current.precip_mm} mm`);
  
  // Calculate dew point (approximation formula)
  const dewPoint = calculateDewPoint(current.temp_c, current.humidity);
  setElement("dewpoint", `${dewPoint}°C`)
  // Calculate dew point (approximation formula)
  const dewPoint = calculateDewPoint(current.temp_c, current.humidity);
  document.getElementById("dewpoint").textContent = `${dewPoint}°C`;
}

// Calculate Dew Point
function calculateDewPoint(temp, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

// Get UV Level Description
function getUVLevel(uv) {
  if (uv <= 2) return `${uv} - Low`;
  if (uv <= 5) return `${uv} - Moderate`;
  if (uv <= 7) return `${uv} - High`;
  if (uv <= 10) return `${uv} - Very High`;
  return `${uv} - Extreme`;
}

// Fetch Country Data
function fetchCountryData(countryName) {
  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(res => res.json())
    .then(data => {
      if (data && data[0]) {
        displayCountryData(data[0]);
      }
    })
    .catch(error => {
     Helper function to safely set element content
  const setElement = (id, content) => {
    const el = document.getElementById(id);
    if (el) el.textContent = content;
  };
  
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  
  // Flag
  if (country.flags && country.flags.png) {
    setHTML("countryFlag", `<img src="${country.flags.png}" alt="${country.name.common} flag">`);
  }
  
  // Main Info
  setElement("countryName", country.name.common || "-");
  setElement("countryCapital", (country.capital && country.capital[0]) ? `Capital: ${country.capital[0]}` : "No capital information");
  
  // Details
  setElement("officialName", country.name.official || "-");
  setElement("languages", country.languages ? Object.values(country.languages).join(", ") : "-");
  setElement("population", country.population ? country.population.toLocaleString() : "-");
  setElement("regionCountry", country.region || "-");
  setElement("currency", country.currencies ? Object.keys(country.currencies).join(", ") + ` (${Object.values(country.currencies)[0]?.name || ""})` : "-");
  setElement("timezoneCountry", (country.timezones && country.timezones[0]) || "-")
  // Main Info
  document.getElementById("countryName").textContent = country.name.common || "-";
  document.getElementById("countryCapital").textContent = (country.capital && country.capital[0]) ? `Capital: ${country.capital[0]}` : "No capital information";
  
  // Details
  document.getElementById("officialName").textContent = country.name.official || "-";
  document.getElementById("languages").textContent = country.languages ? Object.values(country.languages).join(", ") : "-";
  document.getElementById("population").textContent = country.population ? country.population.toLocaleString() : "-";
  document.getElementById("regionCountry").textContent = country.region || "-";
  document.getElementById("currency").textContent = country.currencies ? Object.keys(country.currencies).join(", ") + ` (${Object.values(country.currencies)[0]?.name || ""})` : "-";
  document.getElementById("timezoneCountry").textContent = (country.timezones && country.timezones[0]) || "-";
}

// Set Background by Weather
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
    weatherKey = "stormy";
  } else if (conditionText.includes("clear") || conditionText.includes("sunny")) {
    weatherKey = isDay ? "sunny" : "night";
  } else if (isDay === 0) {
    weatherKey = "night";
  }

  console.log("Setting weather background:", weatherKey);
  activateVideo(weatherKey);
}

// Activate Video Background
function activateVideo(weatherKey) {
  const videos = document.querySelectorAll("#bg-videos video");
  
  videos.forEach(video => {
    if (video.dataset.weather === weatherKey) {
  const cityInput = document.getElementById("cityName");
  if (cityInput) {
    cityInput.value = "";
    
    // Allow Enter key to search
    cityInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        searchWeather();
      }
    });
  }
  
  // Optional: Load a default city
  // setTimeout(() => {
  //   if (cityInput) cityInput.value = "London";
  //   searchWeather();
  // }, 500););
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  // Set default background
  activateVideo("sunny");
  
  // Clear input on load
  document.getElementById("cityName").value = "";
  
  // Optional: Load a default city
  // setTimeout(() => {
  //   document.getElementById("cityName").value = "London";
  //   searchWeather();
  // }, 500);
});

// Allow Enter key to search
document.getElementById("cityName")?.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

