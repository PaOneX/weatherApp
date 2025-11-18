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
        fetch(`https://restcountries.com/v3.1/name/${data.location.country}`)
        .then((res) => res.json())
        .then((data) => {
            const c = data[0] || {};
            document.getElementById("modal-name").innerText = (c.name && c.name.common) || "-";
                    if (c.flags && c.flags.png) {
                        document.getElementById("modal-flag").innerHTML = `<img crossorigin="anonymous" src="${c.flags.png}" alt="flag" style="max-width:100%;height:auto;">`;
                    } else {
                        document.getElementById("modal-flag").innerHTML = "";
                    }

                    if (c.coatOfArms && c.coatOfArms.png) {
                        document.getElementById("modal-symbol").innerHTML = `<img crossorigin="anonymous" src="${c.coatOfArms.png}" alt="symbol" style="max-width:80px;height:auto;">`;
                    } else {
                        document.getElementById("modal-symbol").innerHTML = "";
                    }
            document.getElementById("modal-officialName").innerText = (c.name && c.name.official) || "-";
            document.getElementById("modal-nativeName").innerText = (c.name && c.name.nativeName && Object.values(c.name.nativeName)[0] && Object.values(c.name.nativeName)[0].official) || "-";
            document.getElementById("modal-capital").innerText = (c.capital && c.capital[0]) || "-";
            document.getElementById("modal-region").innerText = c.region || "-";
            document.getElementById("modal-area").innerText = c.area || "-";
            document.getElementById("modal-population").innerText = c.population ? c.population.toLocaleString() : "-";
            document.getElementById("modal-continent").innerText = (c.continents && c.continents[0]) || "-";
            document.getElementById("modal-currency").innerText = c.currencies ? Object.keys(c.currencies)[0] : "-";
            document.getElementById("modal-language").innerText = c.languages ? Object.values(c.languages).join(", ") : "-";
            document.getElementById("timeZone").innerText = (c.timezones && c.timezones[0]) || "-";
            document.getElementById("location").innerText = (c.maps && c.maps.openStreetMaps) || "-";
            
            // Extract colors from flag and apply to modal - wait for modal to be in DOM
            if (c.flags && c.flags.png) {
                setTimeout(() => {
                    extractFlagColorsAndApplyToModal(c.flags.png);
                }, 100);
            }
        })
        
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

// Extract dominant colors from flag image and apply to modal
function extractFlagColorsAndApplyToModal(flagUrl) {
    console.log("Extracting colors from flag:", flagUrl);
    const flagImg = new Image();
    flagImg.crossOrigin = 'anonymous';
    
    flagImg.onload = function() {
        console.log("Flag image loaded, extracting colors...");
        try {
            const canvas = document.createElement('canvas');
            canvas.width = flagImg.width;
            canvas.height = flagImg.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(flagImg, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            const colorMap = {};
            
            // Sample pixels (every 10th pixel for performance)
            for (let i = 0; i < pixels.length; i += 40) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];
                
                // Skip transparent and very light/dark pixels
                if (a < 125 || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
                
                const key = `${Math.floor(r / 10) * 10},${Math.floor(g / 10) * 10},${Math.floor(b / 10) * 10}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }
            
            // Get top 3 colors
            const sortedColors = Object.entries(colorMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([color]) => {
                    const [r, g, b] = color.split(',').map(Number);
                    return { r, g, b };
                });
            
            console.log("Extracted colors:", sortedColors);
            
            if (sortedColors.length > 0) {
                applyModalBackgroundGradient(sortedColors);
            }
        } catch (e) {
            console.warn('Could not extract colors from flag (canvas error):', e);
        }
    };
    
    flagImg.onerror = function() {
        console.warn('Failed to load flag image:', flagUrl);
    };
    
    flagImg.src = flagUrl;
}

// Apply gradient background to modal based on flag colors
function applyModalBackgroundGradient(colors) {
    console.log("Applying modal background gradient with colors:", colors);
    
    const modalContent = document.querySelector('.modal-content');
    
    if (!modalContent) {
        console.warn('Modal content element not found');
        return;
    }
    
    const [c1, c2 = c1, c3 = c1] = colors;
    
    // Create a dynamic style tag for the modal
    let styleTag = document.getElementById('modal-gradient-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'modal-gradient-style';
        document.head.appendChild(styleTag);
    }
    
    // Create a gradient from the top flag colors
    const gradient = `linear-gradient(135deg, rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.25) 0%, rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.15) 50%, rgba(${c3.r}, ${c3.g}, ${c3.b}, 0.1) 100%)`;
    
    console.log("Applying gradient:", gradient);
    console.log("RGB values - c1:", c1, "c2:", c2, "c3:", c3);
    
    // Use !important to override Bootstrap
    styleTag.textContent = `
        .modal-content {
            background: ${gradient} !important;
            border-color: rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.5) !important;
        }
        .modal-body {
            background: ${gradient} !important;
        }
    `;
}