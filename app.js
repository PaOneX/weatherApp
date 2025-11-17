function searchWeather() {
    console.log("Button clicked! Searching for weather...");        

    let cityName = document.getElementById("cityName").value;

    if (!cityName) {
        alert("Please enter a city name");
        return;
    }

    fetch(`http://api.weatherapi.com/v1/current.json?key=18c575faf6fd4df29b190236251211&q=${cityName}`)
    .then(res=>res.json())
    .then(data=>{
        if (data.error) {
            alert("City not found!");
            return;
        }
        console.log(data);
        document.getElementById("name").innerText = data.location.name;
        document.getElementById("region").innerText = data.location.region;
        document.getElementById("country").innerText = data.location.country;
        document.getElementById("temp_c").innerText = data.current.temp_c + " °C";
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("icon").innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Icon">`;
        document.getElementById("date").innerText = data.current.last_updated;
        
        // Set background based on weather condition
        setBackgroundByWeather(data.current.condition.text, data.current.is_day);
    })
    .catch(error => {
        console.error("Error fetching weather:", error);
        alert("Error fetching weather data!");
    });
}

function setBackgroundByWeather(condition, isDay) {
    const body = document.body;
    const conditionText = condition.toLowerCase();
    
    console.log("Setting background for:", conditionText, "IsDay:", isDay);
    
    // Remove all weather classes
    body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy', 'night', 'stormy');
    let weatherKey = 'sunny';

    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
        weatherKey = 'rainy';
    } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
        weatherKey = 'cloudy';
    } else if (conditionText.includes('snow') || conditionText.includes('blizzard')) {
        weatherKey = 'snowy';
    } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
        weatherKey = 'stormy';
    } else if (conditionText.includes('clear') || conditionText.includes('sunny')) {
        weatherKey = isDay ? 'sunny' : 'night';
    } else if (isDay === 0) {
        weatherKey = 'night';
    } else {
        weatherKey = 'sunny';
    }

    body.classList.add(weatherKey);

    // Activate corresponding background video (if present) and pause others
    activateVideo(weatherKey);
}

function activateVideo(weatherKey) {
    const videos = document.querySelectorAll('#bg-videos video');
    if (!videos || videos.length === 0) return;

    videos.forEach(v => {
        try {
            if (v.dataset.weather === weatherKey) {
                // make visible and play
                v.style.visibility = 'visible';
                v.style.opacity = '1';
                // attempt to play; browsers may block autoplay unless muted (we set muted)
                v.play().catch(err => {
                    // ignore autoplay errors; the fallback background-image will show
                    console.warn('Video play prevented or failed:', err);
                });
            } else {
                v.style.opacity = '0';
                // pause and reset time to conserve resources
                v.pause();
                try { v.currentTime = 0; } catch(e) {}
                v.style.visibility = 'hidden';
            }
        } catch (e) {
            console.error('Error activating video:', e);
        }
    });
}

// Set initial background on page load
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('sunny');
    // Ensure initial video is activated if available
    activateVideo('sunny');
});