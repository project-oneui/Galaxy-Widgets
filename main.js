const { app, BrowserWindow, Menu, Tray } = require('electron');
const express = require('express');
const server = require('./src/js/battery-listener');
const os = require('os')
const fs = require('fs')
const path = require('path');
const { json } = require('body-parser');
const { exit } = require('process');
let settingsWindow = null;
const icon = __dirname + '/src/res/Icon.png'
const iconTray = __dirname + '/src/res/IconTray.png'


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

const positionJSON = JSON.stringify(positionData, null, 4);  // null and 4 for pretty formatting

if (!fs.existsSync(folderPath + "\\widgetPositions.json")) fs.writeFileSync(folderPath + "\\widgetPositions.json", positionJSON)

app.on('ready', () => {
    tray = new Tray(iconTray)
    const contextMenu = Menu.buildFromTemplate([
        { role: 'quit' },
    ])
    tray.setToolTip('OneUI Windows')
    tray.setContextMenu(contextMenu)


    musicWidget = new BrowserWindow({
        width: 390,
        height: 125,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    musicWidget.loadFile('./src/music.html');

    musicWidget.setIgnoreMouseEvents(true)

    batteryWidget = new BrowserWindow({
        width: 390,
        height: 125,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    batteryWidget.loadFile('./src/battery.html');

    batteryWidget.setIgnoreMouseEvents(true)

    deviceCareWidget = new BrowserWindow({
        width: 390,
        height: 125,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    deviceCareWidget.loadFile('./src/deviceCare.html');

    deviceCareWidget.setIgnoreMouseEvents(true)

    weatherWidget = new BrowserWindow({
        width: 390,
        height: 125,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    weatherWidget.loadFile('./src/weather.html');

    weatherWidget.setIgnoreMouseEvents(true)

    function setPositions() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + "\\widgetPositions.json", 'utf8'));
        musicWidget.setPosition(parseInt(jsonData.musicWidget.x), parseInt(jsonData.musicWidget.y));
        batteryWidget.setPosition(parseInt(jsonData.batteryWidget.x), parseInt(jsonData.batteryWidget.y));
        deviceCareWidget.setPosition(parseInt(jsonData.deviceCareWidget.x), parseInt(jsonData.deviceCareWidget.y));
        weatherWidget.setPosition(parseInt(jsonData.weatherWidget.x), parseInt(jsonData.weatherWidget.y));
    }

    setPositions()
    setInterval(setPositions, 3000)
});

try {
    require('electron-reloader')(module)
} catch (_) { }