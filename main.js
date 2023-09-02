const { app, BrowserWindow, Menu, Tray } = require('electron');
const express = require('express');
const server = require('./src/js/battery-listener');
const os = require('os')
const fs = require('fs')
const path = require('path');
const { json } = require('body-parser');
const { exit } = require('process');
const { open } = require('fs/promises');
const icon = __dirname + '/src/res/Icon.png'
const iconTray = __dirname + '/src/res/IconTray.png'

let settingsWindow = null;
let musicWidget = null;
let batteryWidget = null;
let deviceCareWidget = null;
let weatherWidget = null;

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'OneUI-Widgets');

const positionData = {
    musicWidget: {
        y: "75",
        x: "75"
    },
    batteryWidget: {
        y: "225",
        x: "75"
    },
    deviceCareWidget: {
        y: "375",
        x: "75"
    },
    weatherWidget: {
        y: "525",
        x: "75"
    }
};

const stateData = {
    musicWidget: {
        show: "true"
    },
    batteryWidget: {
        show: "true"
    },
    deviceCareWidget: {
        show: "true"
    },
    weatherWidget: {
        show: "true"
    }
};

const positionJSON = JSON.stringify(positionData, null, 4);  // null and 4 for pretty formatting

if (!fs.existsSync(folderPath + "\\widgetPositions.json")) fs.writeFileSync(folderPath + "\\widgetPositions.json", positionJSON)

const stateJSON = JSON.stringify(stateData, null, 4);  // null and 4 for pretty formatting

if (!fs.existsSync(folderPath + "\\widgetStates.json")) fs.writeFileSync(folderPath + "\\widgetStates.json", stateJSON)

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
            // If the settings window already exists, focus on it
            if (settingsWindow.isMinimized()) settingsWindow.restore();
            settingsWindow.focus();
            return;
        }

        // Create a new settings window
        settingsWindow = new BrowserWindow({
            width: 400,
            height: 600,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
            }
        });

        settingsWindow.loadFile('./src/settings.html'); // Load your HTML file here

        settingsWindow.on('closed', () => {
            settingsWindow = null;
        });
    }

    const widgetsData = {
        widgets: [
            {
                "name": "musicWidget",
                "width": 390,
                "height": 125,
                "html": "./src/music.html"
            },
            {
                "name": "batteryWidget",
                "width": 390,
                "height": 125,
                "html": "./src/battery.html"
            },
            {
                "name": "deviceCareWidget",
                "width": 390,
                "height": 125,
                "html": "./src/deviceCare.html"
            },
            {
                "name": "weatherWidget",
                "width": 390,
                "height": 125,
                "html": "./src/weather.html"
            }
        ]
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
                    skipTaskbar: true,
                    webPreferences: {
                        contextIsolation: false,
                        nodeIntegration: true,
                    }
                });

                widgetWindow.webContents.openDevTools()

                eval(`${widget.name} = widgetWindow`)

                if (eval(widget.name) != null) {
                    widgetWindow.setBounds({
                        width: 390,
                        height: 125,
                        x: parseInt(widgetPositions[widget.name].x),
                        y: parseInt(widgetPositions[widget.name].y)
                    });
                }

                widgetWindow.loadFile(path.join(__dirname, widget.html));

                widgetWindow.on('closed', () => {
                    eval(`${widget.name} = null`);
                    // Handle window closed event as needed
                });
            } else if (widgetStates[widget.name].show != "true" && eval(widget.name) != null) {
                eval(`${widget.name}.destroy()`);
                eval(`${widget.name} = null`);
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