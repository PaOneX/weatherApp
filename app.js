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
    
    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
        body.classList.add('rainy');
        
    } 
    else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
        body.classList.add('cloudy');
    }
    else if (conditionText.includes('snow') || conditionText.includes('blizzard')) {
        body.classList.add('snowy');
    }
    else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
        body.classList.add('stormy');
       
    }
    else if (conditionText.includes('clear') || conditionText.includes('sunny')) {
        if (isDay) {
            body.classList.add('sunny');
         
        } else {
            body.classList.add('night');
        }
    }
    else if (isDay === 0) {
        body.classList.add('night');
    }
    else {
        body.classList.add('sunny');
    }
    
}

// Set initial background on page load
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('sunny');
});