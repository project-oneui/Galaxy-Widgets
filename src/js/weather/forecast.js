const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8')
const weatherConditions = require('../../json/weather_conditions.json');

window.addEventListener("DOMContentLoaded", () => {
    async function setWeatherInfo() {
        const responseIP = await fetch('https://api.ipify.org?format=json');
        const dataIP = await responseIP.json();
        const publicIP = dataIP.ip;

        const responseLocation = await fetch(`http://ip-api.com/json/${publicIP}`);
        const dataLocation = await responseLocation.json();
        const IPLocation = dataLocation.city;


        if (weatherOptions.iplocation == true) {
            var weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=0d6f65c595974c82b19143504232708&q=${IPLocation}&days=6&aqi=no&alerts=no`
        } else if (weatherOptions.iplocation == false && weatherOptions.country != "" && weatherOptions.name != "") {
            const Location = weatherOptions.weather_name + "," + weatherOptions.weather_country
            var weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=0d6f65c595974c82b19143504232708&q=${Location}&days=6&aqi=no&alerts=no`
        }

        const responseForecast = await fetch(weatherURL);
        const forecastData = await responseForecast.json();


        document.getElementById('city').innerHTML = forecastData.location.name;
        document.getElementById('temparature').innerHTML = forecastData.current.temp_c + "°";

        for (i = 0; i < 3; i++) {
            const date = new Date(forecastData.forecast.forecastday[i].date_epoch * 1000)
            const weatherIcons = document.getElementsByClassName('weather-icon')
            const days = document.getElementsByClassName('day')

            const weatherImageData = weatherConditions.find(codeObj => codeObj.code === forecastData.forecast.forecastday[i].day.condition.code);

            weatherIcons[i].src = `../../res/weather/${weatherImageData.day}`

            var dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thrus', 'Fri', 'Sat'];

            days[i].innerHTML = dayNames[date.getDay()]
        }
    }
    setWeatherInfo()
})