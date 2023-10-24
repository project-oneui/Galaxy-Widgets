const os = require('os')
const fs = require('fs')
const path = require('path');
const contrast = require('wcag-contrast')

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8')
const weatherConditions = require('../../json/weather_conditions.json');

window.addEventListener("DOMContentLoaded", () => {
    const containerMain = document.getElementById("container-main");

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    function findBetterContrast(rgb1, rgb2) {
        const contrast1 = contrast.rgb(rgb1, [colorData.red, colorData.green, colorData.blue])
        const contrast2 = contrast.rgb(rgb2, [colorData.red, colorData.green, colorData.blue])
        if (contrast1 > contrast2) {
            return `rgb(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]})`;
        } else {
            return `rgb(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]})`;
        }
    }

    const textColor = findBetterContrast(textColors[0], textColors[1])
    const secondaryColor = findBetterContrast(secondaryColors[0], secondaryColors[1])

    containerMain.style.color = textColor;

    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    document.getElementById('temparature').style.color = secondaryColor;

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

        console.log(forecastData)

        document.getElementById('city').innerHTML = forecastData.location.name;
        document.getElementById('temparature').innerHTML = forecastData.current.temp_c + "°";

        for (i = 0; i < 3; i++) {
            const date = new Date(forecastData.forecast.forecastday[i].date_epoch * 1000)
            console.log(date.getDay())
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