const os = require('os')
const fs = require('fs')
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// All JSONs that are created for storing information/settings

const positionData = {
    musicWidget: { y: "75", x: "75" },
    batteryWidget: { y: "225", x: "75" },
    weatherWidget: { y: "550", x: "75" },
    topStoriesWidget: { y: "75", x: "475" },
    calendarWidget: { y: "300", x: "475" },
};

const stateData = {
    musicWidget: { show: "true", size: "medium" },
    batteryWidget: { show: "true", size: "medium" },
    weatherWidget: { show: "true", size: "small" },
    topStoriesWidget: { show: "true", size: "medium" },
    calendarWidget: { show: "true", size: "small" },
};

const weatherData = {
    iplocation: true,
    weather_country: "",
    weather_name: "",
};

const flightData = {
    flight_code: "",
};

const colorData = {
    background: {
        red: 28,
        green: 28,
        blue: 28
    },
    text: {
        red: 250,
        green: 250,
        blue: 250
    },
    secondary: {
        red: 120,
        green: 120,
        blue: 120
    },
    primary: {
        red: 170,
        green: 167,
        blue: 195
    }
};

function createJSONFile(filePath, data) {
    let existingData = {};

    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        existingData = JSON.parse(fileContent);
    }

    // Merge existing data with new data, adding missing keys and setting default values
    const updatedData = {
        ...data,
        ...existingData,
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4));
}

// Creates or updates JSON files for the app
createJSONFile(path.join(folderPath, 'widgetPositions.json'), positionData);
createJSONFile(path.join(folderPath, 'widgetStates.json'), stateData);
createJSONFile(path.join(folderPath, 'weatherOptions.json'), weatherData);
createJSONFile(path.join(folderPath, 'flightOptions.json'), flightData);
createJSONFile(path.join(folderPath, 'color.json'), colorData);