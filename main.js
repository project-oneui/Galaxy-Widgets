const { app, BrowserWindow, Menu, Tray } = require('electron');
const Vibrant = require('node-vibrant');
const express = require('express');
const server = require('./src/js/battery-listener');
const os = require('os')
const fs = require('fs')
const path = require('path');
const icon = __dirname + '/favicon.ico'
const { spawn } = require('child_process');

// checks if the appExe is named electron so it doesn't autostart electron.exe while developing
if (!app.getPath('exe').includes('electron')) {
    // starts the app at login
    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath('exe')
    });
}



// starts the background Serivce which provides information for the music and device care widget
// const backgroundServicePath = './backgroundService/backgroundService.exe';
const backgroundServicePath = path.join(path.dirname(app.getPath('exe')), 'backgroundService', 'backgroundService.exe')

// Check if the file exists
if (fs.existsSync(backgroundServicePath)) {
    const backgroundServiceChild = spawn(backgroundServicePath);
}

// declares the variables so the app doesnt outputs many error 
let musicWidget = null;
let batteryWidget = null;
let deviceCareWidget = null;
let weatherWidget = null;
let topStoriesWidget = null;
let flightWidget = null;
let calendarWidget = null;
let quickNotesWidget = null;
let untisWidget = null;
let digitalClockWidget = null;
let forecastWidget = null;
let upcomingMoviesWidget = null;

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// All JSONs that are created for storing information/settings

const positionData = {
    musicWidget: { y: "75", x: "75" },
    batteryWidget: { y: "225", x: "75" },
    deviceCareWidget: { y: "400", x: "75" },
    weatherWidget: { y: "550", x: "75" },
    flightWidget: { y: "700", x: "75" },
    topStoriesWidget: { y: "75", x: "475" },
    calendarWidget: { y: "300", x: "475" },
    quickNotesWidget: { y: "550", x: "475" },
    untisWidget: { y: "900", x: "75" },
    digitalClockWidget: { y: "75", x: "875" },
    forecastWidget: { y: "750", x: "475" },
    upcomingMoviesWidget: { y: "200", x: "875" },
};

const stateData = {
    musicWidget: { show: "true" },
    batteryWidget: { show: "true" },
    deviceCareWidget: { show: "true" },
    weatherWidget: { show: "true" },
    topStoriesWidget: { show: "false" },
    flightWidget: { show: "false" },
    calendarWidget: { show: "true" },
    quickNotesWidget: { show: "true" },
    untisWidget: { show: "false" },
    digitalClockWidget: { show: "true" },
    forecastWidget: { show: "false" },
    upcomingMoviesWidget: { show: "false" },
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
    red: 28,
    green: 28,
    blue: 28
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


// info for widget windows
const widgetsData = {
    widgets: [
        { name: "musicWidget", width: 390, height: 125, html: "./src/widgets/music/music.html", "clickthrough": true },
        { name: "batteryWidget", width: 390, height: 150, html: "./src/widgets/deviceCare/battery.html", "clickthrough": true },
        { name: "deviceCareWidget", width: 390, height: 125, html: "./src/widgets/deviceCare/deviceCare.html", "clickthrough": true },
        { name: "weatherWidget", width: 390, height: 125, html: "./src/widgets/weather/weather.html", "clickthrough": true },
        { name: "topStoriesWidget", width: 390, height: 200, html: "./src/widgets/news/topStories.html", "clickthrough": true },
        { name: "flightWidget", width: 390, height: 175, html: "./src/widgets/wallet/flight.html", "clickthrough": true },
        { name: "calendarWidget", width: 390, height: 225, html: "./src/widgets/calendar/calendar.html", "clickthrough": true },
        { name: "quickNotesWidget", width: 390, height: 175, html: "./src/widgets/notes/quickNotes.html", "clickthrough": false },
        { name: "untisWidget", width: 390, height: 125, html: "./src/widgets/untis.html", "clickthrough": true },
        { name: "digitalClockWidget", width: 390, height: 100, html: "./src/widgets/clock/digitalClock.html", "clickthrough": true },
        { name: "forecastWidget", width: 390, height: 175, html: "./src/widgets/weather/forecast.html", "clickthrough": true },
        { name: "upcomingMoviesWidget", width: 390, height: 200, html: "./src/widgets/videoPlayer/upcomingMovies.html", "clickthrough": true },
    ],
};

app.on('ready', () => {
    // creates tray for quitting the app+
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { role: 'quit' },
    ])
    tray.setToolTip('Samsung Widgets')
    tray.setContextMenu(contextMenu)

    function setStates() {
        const widgetStates = JSON.parse(fs.readFileSync(folderPath + "\\widgetStates.json"))
        const widgetPositions = JSON.parse(fs.readFileSync(folderPath + "\\widgetPositions.json"))

        // goes through each widget
        widgetsData.widgets.forEach(widget => {
            // checks if the widget is enabled and if it doesnt exist (== null)
            if (widgetStates[widget.name].show == "true" && eval(widget.name) == null) {
                const widgetWindow = new BrowserWindow({
                    width: widget.width,
                    height: widget.height,
                    frame: false,
                    transparent: true,
                    resizable: false,
                    transparency: true,
                    skipTaskbar: true,
                    webPreferences: {
                        contextIsolation: false,
                        nodeIntegration: true,
                    }
                });

                // sets clickthrough based on widgetsData
                widgetWindow.setIgnoreMouseEvents(widget.clickthrough)
                
                // sets the variable to something else than null so it wont get created again
                eval(`${widget.name} = widgetWindow`)

                // sets the position | uses setBounds because setPosition makes the widget bigger in anything else than 100% scaling
                if (eval(widget.name) != null) {
                    widgetWindow.setBounds({
                        width: widget.width,
                        height: widget.height,
                        x: parseInt(widgetPositions[widget.name].x),
                        y: parseInt(widgetPositions[widget.name].y)
                    });
                }

                widgetWindow.loadFile(path.join(__dirname, widget.html));

                widgetWindow.webContents.openDevTools()

                // sets the variable again to null when its closed
                widgetWindow.on('closed', () => {
                    eval(`${widget.name} = null`);
                });

                // fixes widget appearing in taskbar
                widgetWindow.on('focus', () => {
                    widgetWindow.setSkipTaskbar(true)
                });

            }
            // destroys window if it gets deactivated
            else if (widgetStates[widget.name].show != "true" && eval(widget.name) != null) {
                eval(`${widget.name}.destroy()`);
                eval(`${widget.name} = null`);

            }
            // fixes widget appearing in taskbar
            else if (widgetStates[widget.name].show == "true" && eval(widget.name) != null) {
                (eval(`${widget.name}.setSkipTaskbar(true)`))
            }
        });
    }

    setStates()
    setInterval(function () {
        setStates();
    }, 500);
});

// hot reloader for easier development
try {
    require('electron-reloader')(module)
} catch (_) { }