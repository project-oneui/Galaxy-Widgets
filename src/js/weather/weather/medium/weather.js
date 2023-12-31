function convertHoursToAMPM(date) {
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var timeString = hours + ' ' + ampm;
    return timeString;
}

async function getLocation() {
    const weatherOptions = JSON.parse(fs.readFileSync(folderPath + "\\weatherOptions.json"), 'utf8');
    const responseIP = await fetch('https://api.ipify.org?format=json');
    const dataIP = await responseIP.json();
    const publicIP = dataIP.ip;

    const responseLocation = await fetch(`http://ip-api.com/json/${publicIP}`);
    const dataLocation = await responseLocation.json();
    const IPLocation = dataLocation.city;

    if (weatherOptions.iplocation == true) {
        return IPLocation;
        // if false check if any location even exists | if not use ip location
    } else if (weatherOptions.iplocation == false && weatherOptions.country != "" && weatherOptions.name != "") {
        const Location = weatherOptions.weather_name + ", " + weatherOptions.weather_country
        return Location;
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const weatherConditions = require('../../../../json/weather_conditions.json');

    async function changeWeatherInfo() {
        var weatherURL = `https://api.weatherapi.com/v1/current.json?key=0d6f65c595974c82b19143504232708&q=${await getLocation()}&aqi=no`

        const responseWeather = await fetch(weatherURL);
        const dataWeather = await responseWeather.json();
        const isDay = dataWeather.current.is_day;
        const localTime = dataWeather.location.localtime;
        const localTimeSplit = localTime.split(' ');

        document.getElementById("weather-temperature").innerHTML = dataWeather.current.temp_c.toFixed() + "°"
        document.getElementById("weather-location").innerHTML = dataWeather.location.name;
        document.getElementById("weather-time").innerHTML = localTimeSplit[1]
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

    async function setForecastInfo() {
        var weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=0d6f65c595974c82b19143504232708&q=${await getLocation()}&days=2&aqi=no&alerts=no`

        const responseForecast = await fetch(weatherURL);
        const forecastData = await responseForecast.json();
        const isDay = forecastData.current.is_day;

        for (let i = 0; i < 5; i++) {
            const currentDate = new Date()
            const weatherIcons = document.getElementsByClassName('forecast-icon');
            const hours = document.getElementsByClassName('hour');

            // i dont even know how to works but it does work | checks if some of the forecast hours will be in the next day so no errors appear
            if (currentDate.getHours() + i > 23) {
                var weatherImageData = weatherConditions.find(codeObj => codeObj.code === forecastData.forecast.forecastday[1].hour[(currentDate.getHours() + i) - 24].condition.code);
                var time_epoch = forecastData.forecast.forecastday[1].hour[(currentDate.getHours() + i) - 24].time_epoch * 1000
            } else {
                var weatherImageData = weatherConditions.find(codeObj => codeObj.code === forecastData.forecast.forecastday[0].hour[currentDate.getHours() + i].condition.code);
                var time_epoch = forecastData.forecast.forecastday[0].hour[currentDate.getHours() + i].time_epoch * 1000
            }

            const weatherIconSrc = (isDay == 0) ? `../../../../res/weather/${weatherImageData.night}` : `../../../../res/weather/${weatherImageData.day}`

            weatherIcons[i].src = weatherIconSrc;
            hours[i].innerHTML = convertHoursToAMPM(new Date(time_epoch))
        }
    }

    changeWeatherInfo()
    setForecastInfo();
});
