const { app, BrowserWindow, Menu, Tray } = require('electron');
const express = require('express');
const server = require('./src/js/battery-listener');
const os = require('os')
const fs = require('fs')
const path = require('path');
const icon = __dirname + 'favicon.ico'
const iconTray = __dirname + '/src/res/IconTray.png'

let settingsWindow = null;
let musicWidget = null;
let batteryWidget = null;
let deviceCareWidget = null;
let weatherWidget = null;
let newsWidget = null;
let flightWidget = null;
let smartThingsWidget = null;
let calendarWidget = null;
let countdownWidget = null;
let notesWidget = null;
let untisWidget = null;

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'OneUI-Widgets');

// All JSONs that are created for storing information/settings

const positionData = {
    musicWidget: { y: "75", x: "75" },
    batteryWidget: { y: "225", x: "75" },
    deviceCareWidget: { y: "400", x: "75" },
    weatherWidget: { y: "550", x: "75" },
    flightWidget: { y: "700", x: "75" },
    smartThingsWidget: { y: "300", x: "475" },
    newsWidget: { y: "75", x: "475" },
    calendarWidget: { y: "300", x: "475" },
    countdownWidget: { y: "525", x: "475" },
    notesWidget: { y: "725", x: "475" },
    untisWidget: { y: "900", x: "75" },
};

const stateData = {
    musicWidget: { show: "true" },
    batteryWidget: { show: "true" },
    deviceCareWidget: { show: "true" },
    weatherWidget: { show: "true" },
    newsWidget: { show: "false" },
    flightWidget: { show: "false" },
    smartThingsWidget: { show: "false" },
    calendarWidget: { show: "true" },
    countdownWidget: { show: "false" },
    notesWidget: { show: "true" },
    untisWidget: { show: "false" },
};

const weatherData = {
    iplocation: true,
    weather_country: "",
    weather_name: "",
};

const flightData = {
    flight_code: "",
};

function createJSONFile(filePath, data) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

createJSONFile(path.join(folderPath, 'widgetPositions.json'), positionData);
createJSONFile(path.join(folderPath, 'widgetStates.json'), stateData);
createJSONFile(path.join(folderPath, 'weatherOptions.json'), weatherData);
createJSONFile(path.join(folderPath, 'flightOptions.json'), flightData);


// info for widget windows
const widgetsData = {
    widgets: [
        { name: "musicWidget", width: 390, height: 125, html: "./src/widgets/music.html", "clickthrough": true },
        { name: "batteryWidget", width: 390, height: 150, html: "./src/widgets/battery.html", "clickthrough": true },
        { name: "deviceCareWidget", width: 390, height: 125, html: "./src/widgets/deviceCare.html", "clickthrough": true },
        { name: "weatherWidget", width: 390, height: 125, html: "./src/widgets/weather.html", "clickthrough": true },
        { name: "newsWidget", width: 390, height: 200, html: "./src/widgets/news.html", "clickthrough": true },
        { name: "flightWidget", width: 390, height: 175, html: "./src/widgets/flight.html", "clickthrough": true },
        { name: "smartThingsWidget", width: 390, height: 125, html: "./src/widgets/smartThings.html", "clickthrough": true },
        { name: "calendarWidget", width: 390, height: 200, html: "./src/widgets/calendar.html", "clickthrough": true },
        { name: "countdownWidget", width: 390, height: 175, html: "./src/widgets/countdown.html", "clickthrough": true },
        { name: "notesWidget", width: 390, height: 175, html: "./src/widgets/notes.html", "clickthrough": false },
        { name: "untisWidget", width: 390, height: 125, html: "./src/widgets/untis.html", "clickthrough": true },
    ],
};

app.on('ready', () => {
    tray = new Tray(iconTray)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Settings', click: () => { openSettings(); } },
        { type: 'separator' },
        { role: 'quit' },
    ])
    tray.setToolTip('OneUI Windows')
    tray.setContextMenu(contextMenu)

    function openSettings() {
        if (settingsWindow) {
            if (settingsWindow.isMinimized()) settingsWindow.restore();
            settingsWindow.focus();
            return;
        }

        settingsWindow = new BrowserWindow({
            width: 400,
            height: 600,
            autoHideMenuBar: true,
            icon: icon,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
            }
        });

        settingsWindow.loadFile('./src/widgets/settings.html');

        settingsWindow.on('closed', () => {
            settingsWindow = null;
        });
    }

    function setStates() {
        const widgetStates = JSON.parse(fs.readFileSync(folderPath + "\\widgetStates.json"))
        const widgetPositions = JSON.parse(fs.readFileSync(folderPath + "\\widgetPositions.json"))
        widgetsData.widgets.forEach(widget => {
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

                widgetWindow.setIgnoreMouseEvents(widget.clickthrough)

                eval(`${widget.name} = widgetWindow`)

                if (eval(widget.name) != null) {
                    widgetWindow.setBounds({
                        width: widget.width,
                        height: widget.height,
                        x: parseInt(widgetPositions[widget.name].x),
                        y: parseInt(widgetPositions[widget.name].y)
                    });
                }

                widgetWindow.loadFile(path.join(__dirname, widget.html));

                widgetWindow.on('closed', () => {
                    eval(`${widget.name} = null`);
                });

                widgetWindow.on('focus', () => {
                    widgetWindow.setSkipTaskbar(true)
                });

            } else if (widgetStates[widget.name].show != "true" && eval(widget.name) != null) {
                eval(`${widget.name}.destroy()`);
                eval(`${widget.name} = null`);
            } else if (widgetStates[widget.name].show == "true" && eval(widget.name) != null) {
                (eval(`${widget.name}.setSkipTaskbar(true)`))
            }


        });
    }

    setStates()
    setInterval(function () {
        setStates();
    }, 500);
});

try {
    require('electron-reloader')(module)
} catch (_) { }