const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8')
const weatherConditions = require('../../json/weather_conditions.json');

window.addEventListener("DOMContentLoaded", () => {
    function convertHoursToAMPM(date) {
        var hours = date.getHours();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (12:00 AM)
        var timeString = hours + ' ' + ampm;
        return timeString;
    }

    async function setWeatherInfo() {
        const responseIP = await fetch('https://api.ipify.org?format=json');
        const dataIP = await responseIP.json();
        const publicIP = dataIP.ip;

        const responseLocation = await fetch(`http://ip-api.com/json/${publicIP}`);
        const dataLocation = await responseLocation.json();
        const IPLocation = dataLocation.city;


        if (weatherOptions.iplocation == true) {
            var weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=0d6f65c595974c82b19143504232708&q=${IPLocation}&days=2&aqi=no&alerts=no`
        } else if (weatherOptions.iplocation == false && weatherOptions.country != "" && weatherOptions.name != "") {
            const Location = weatherOptions.weather_name + "," + weatherOptions.weather_country
            var weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=0d6f65c595974c82b19143504232708&q=${Location}&days=2&aqi=no&alerts=no`
        }

        const responseForecast = await fetch(weatherURL);
        const forecastData = await responseForecast.json();


        document.getElementById('city').innerHTML = forecastData.location.name;
        document.getElementById('temparature').innerHTML = forecastData.current.temp_c + "°";

        for (let i = 0; i < 5; i++) {
            const currentDate = new Date()
            const weatherIcons = document.getElementsByClassName('weather-icon');
            const hours = document.getElementsByClassName('hour');

            if (currentDate.getHours() + i > 23) {
                var weatherImageData = weatherConditions.find(codeObj => codeObj.code === forecastData.forecast.forecastday[1].hour[(currentDate.getHours() + i) - 24].condition.code);
                var time_epoch = forecastData.forecast.forecastday[1].hour[(currentDate.getHours() + i) - 24].time_epoch * 1000
            } else {
                var weatherImageData = weatherConditions.find(codeObj => codeObj.code === forecastData.forecast.forecastday[0].hour[currentDate.getHours() + i].condition.code);
                var time_epoch = forecastData.forecast.forecastday[0].hour[currentDate.getHours() + i].time_epoch * 1000
            }

            weatherIcons[i].src = `../../res/weather/${weatherImageData.day}`;
            hours[i].innerHTML = convertHoursToAMPM(new Date(time_epoch))
        }
    }
    setWeatherInfo()
})