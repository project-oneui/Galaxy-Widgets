const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8')
const weatherConditions = require('../../../../json/weather_conditions.json');

async function changeWeatherInfo() {
    const responseIP = await fetch('https://api.ipify.org?format=json');
    const dataIP = await responseIP.json();
    const publicIP = dataIP.ip;

    const responseLocation = await fetch(`http://ip-api.com/json/${publicIP}`);
    const dataLocation = await responseLocation.json();
    const IPLocation = dataLocation.city;

    if (weatherOptions.iplocation == true) {
        var weatherURL = `https://api.weatherapi.com/v1/current.json?key=0d6f65c595974c82b19143504232708&q=${IPLocation}&aqi=no`
    } else if (weatherOptions.iplocation == false && weatherOptions.country != "" && weatherOptions.name != "") {
        const Location = weatherOptions.weather_name + "," + weatherOptions.weather_country
        var weatherURL = `https://api.weatherapi.com/v1/current.json?key=0d6f65c595974c82b19143504232708&q=${Location}&aqi=no`
    }

    const responseWeather = await fetch(weatherURL);
    const dataWeather = await responseWeather.json();
    const isDay = dataWeather.current.is_day;

    document.getElementById("weather-temperature").innerHTML = dataWeather.current.temp_c.toFixed() + "°"
    document.getElementById("weather-location").innerHTML = dataWeather.location.name;
    document.getElementById("weather-state").innerHTML = dataWeather.current.condition.text

    const weatherImageData = weatherConditions.find(codeObj => codeObj.code === dataWeather.current.condition.code);
    
    // set image and gradient based on if its day or not | 0 = night | 1 = day
    const weatherImageSrc = (isDay == 0) ? `../../../../res/weather/${weatherImageData.night}` : `../../../../res/weather/${weatherImageData.day}`
    const linearGradient = (isDay == 0) ?
        `linear-gradient(180deg, rgba(${dataWeather.current.temp_c * 4}, 60, 120, 1) 0%, rgba(${dataWeather.current.temp_c * 3}, 55, 115, 1) 100%)`
        :
        `linear-gradient(180deg, rgba(${dataWeather.current.temp_c * 6}, 142, 185, 1) 0%, rgba(${dataWeather.current.temp_c * 4}, 102, 145, 1) 100%)`;

    document.getElementById("weather-icon").src = weatherImageSrc;
    document.getElementById("container-main").style.background = linearGradient
}

changeWeatherInfo()
setInterval(changeWeatherInfo, 60 * 1000 * 15)