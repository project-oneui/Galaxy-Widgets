const os = require('os');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

function daysUntilTimestamp(unixTimestamp) {

    // Get the current Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Calculate the difference in seconds
    const timeDifference = unixTimestamp - currentTimestamp;

    // Calculate the number of days remaining
    if (Math.sign(timeDifference) == 1) {
        var daysRemaining = Math.floor(timeDifference / (60 * 60 * 24));
    } else {
        var daysRemaining = Math.floor(Math.abs(timeDifference) / (60 * 60 * 24)) * -1;
    }

    if (daysRemaining == 1) {
        return "Tomorrow"
    } else if (daysRemaining == 0) {
        return "Today"
    } else if (daysRemaining == -1) {
        return "Yesterday"
    } else if (Math.sign(daysRemaining) == 1) {
        return `In ${daysRemaining} days`
    } else if (Math.sign(daysRemaining) == -1) {
        return `${Math.abs(daysRemaining)} days ago`
    }
}

function unixTimestampToAMPM(unixTimestamp) {
    // Convert the Unix timestamp to milliseconds
    const timestampInMilliseconds = unixTimestamp * 1000;

    // Create a Date object from the timestamp
    const date = new Date(timestampInMilliseconds);

    // Get hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    // Add leading zeros to minutes if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Combine and format the time
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedTime;
}

// Function to find the nearest timestamp (departure or arrival) to the current time and return it as a Unix timestamp
function findNearestTimestampWithAirportAndAirlineData(data, type) {
    if (type !== 'departure' && type !== 'arrival') {
        throw new Error('Invalid type. Use "departure" or "arrival".');
    }

    const currentTime = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp

    let nearestTimestamp = null;
    let nearestAirportData = null;
    let nearestAirlineData = null;
    let timeDifference = Infinity;

    for (const flight of data) {
        const timestamp = flight.time.scheduled[type];

        if (!timestamp) {
            continue;
        }

        // Calculate the time difference between current time and the timestamp
        const timeDiff = Math.abs(timestamp - currentTime);

        // Check if the timestamp is closer to current time than the previous nearest timestamp
        if (timeDiff < timeDifference) {
            nearestTimestamp = timestamp;
            nearestAirportData = flight.airport[type === 'departure' ? 'origin' : 'destination'];
            nearestAirlineData = flight.airline;
            timeDifference = timeDiff;
        }
    }

    return {
        timestamp: nearestTimestamp,
        airportData: nearestAirportData,
        airlineData: nearestAirlineData,
    };
}

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");
    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    // check if text should be white or black
    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'var(--text)' : 'black';
    const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-lighter)' : 'var(--secondary-darker)';

    containerMain.style.color = textColor;
    document.getElementById('origin-city').style.color = secondaryColor;
    document.getElementById('destination-city').style.color = secondaryColor;
    document.getElementById('departure').style.color = secondaryColor;
    document.getElementById('arrival').style.color = secondaryColor;

    const points = document.querySelectorAll('point');

    points.forEach(point => {
        point.style.backgroundColor = secondaryColor;
    });

    const flexlines = document.querySelectorAll('flexline')

    flexlines.forEach(flexline => {
        flexline.style.backgroundColor = secondaryColor;
    });


    async function setFlightInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + "\\flightOptions.json"), 'utf8')

        const url = `https://flight-radar1.p.rapidapi.com/flights/get-more-info?query=${jsonData.flight_code}&fetchBy=flight&page=1&limit=100`;
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'X-RapidAPI-Key': '42b765abcfmsh5a33b5a73428661p17fc52jsnad2b8ba90382',
                'X-RapidAPI-Host': 'flight-radar1.p.rapidapi.com'
            }
        };

        if (jsonData.flight_code != "") {
            const response = await fetch(url, options);
            const result = await response.json();
            const arrival = findNearestTimestampWithAirportAndAirlineData(result.result.response.data, 'arrival');
            const departure = findNearestTimestampWithAirportAndAirlineData(result.result.response.data, 'departure')
            document.getElementById("arrival").innerHTML = "Arrival: " + unixTimestampToAMPM(arrival.timestamp)
            document.getElementById("departure").innerHTML = "Departure: " + unixTimestampToAMPM(departure.timestamp)
            document.getElementById("origin-code").innerHTML = departure.airportData.code.iata;
            document.getElementById("destination-code").innerHTML = arrival.airportData.code.iata
            document.getElementById("origin-city").innerHTML = departure.airportData.position.region.city
            document.getElementById("destination-city").innerHTML = arrival.airportData.position.region.city
            document.getElementById("length").innerHTML = daysUntilTimestamp(departure.timestamp)
            document.getElementById("airline").innerHTML = departure.airlineData.name
        }

    }

    setFlightInfo()
    setInterval(setFlightInfo, 1000 * 60 * 60 * 3)
})
