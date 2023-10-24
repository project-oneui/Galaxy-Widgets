const fs = require('fs')
const os = require('os')
const path = require('path')

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8')
const weatherConditions = require('../../json/weather_conditions.json');

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
    const localTime = dataWeather.location.localtime;
    const localTimeSplit = localTime.split(' ')

    document.getElementById("weather-temperature").innerHTML = dataWeather.current.temp_c.toFixed() + "°"
    document.getElementById("weather-location").innerHTML = dataWeather.location.name;
    document.getElementById("weather-time").innerHTML = localTimeSplit[1]
    document.getElementById("weather-state").innerHTML = dataWeather.current.condition.text

    const weatherImageData = weatherConditions.find(codeObj => codeObj.code === dataWeather.current.condition.code);

    if (isDay == "1") {
        document.getElementById("weather-icon").src = `../../res/weather/${weatherImageData.day}`
        document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(${dataWeather.current.temp_c * 6}, 142, 185, 1) 0%, rgba(${dataWeather.current.temp_c * 4}, 102, 145, 1) 100%)`
    } else {
        document.getElementById("weather-icon").src = `../../res/weather/${weatherImageData.night}`
        document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(${dataWeather.current.temp_c * 4}, 70, 120, 1) 0%, rgba(${dataWeather.current.temp_c * 3},55,105, 1) 100%)`
    }
}

changeWeatherInfo()
setInterval(changeWeatherInfo, 60 * 1000 * 15)