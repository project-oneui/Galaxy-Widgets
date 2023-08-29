const weatherConditions = require('./json/weather_conditions.json');

async function changeWeatherInfo() {
    const responseIP = await fetch('https://api.ipify.org?format=json');
    const dataIP = await responseIP.json();
    const publicIP = dataIP.ip;

    const responseLocation = await fetch(`http://ip-api.com/json/${publicIP}`);
    const dataLocation = await responseLocation.json();
    const Location = dataLocation.city;

    const weatherURL = `https://api.weatherapi.com/v1/current.json?key=ff5e2c51b19f415fad4172514232708&q=${Location}&aqi=no`

    const responseWeather = await fetch(weatherURL);
    const dataWeather = await responseWeather.json();
    const isDay = dataWeather.current.is_day;
    const localTime = dataWeather.location.localtime;
    const localTimeSplit = localTime.split(' ')

    document.getElementById("weather-temperature").innerHTML = dataWeather.current.temp_c + "°"
    document.getElementById("weather-location").innerHTML = Location;
    document.getElementById("weather-time").innerHTML = localTimeSplit[1]

    const weatherImageData = weatherConditions.find(codeObj => codeObj.code === dataWeather.current.condition.code);

    if (isDay == "1") {
        
        document.getElementById("weather-icon").src = `./res/weather/${weatherImageData.day}`
        document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(73, 112, 155, 1) 0%, rgba(43, 82, 125, 1) 100%)`
    } else {
        document.getElementById("weather-icon").src = `./res/weather/${weatherImageData.night}`
        document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(65, 65, 65, 1) 0%, rgba(35,35,35, 1) 100%)`

    }
}

changeWeatherInfo()
setInterval(changeWeatherInfo, 60 * 1000 * 15)