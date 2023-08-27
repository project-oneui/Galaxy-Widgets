const { app, BrowserWindow } = require('electron');
const express = require('express');
const server = require('./src/js/battery-listener');

app.on('ready', () => {
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

    // Position the window in the top left corner with a margin
    musicWidget.setPosition(75, 75);
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

    // Position the window in the top left corner with a margin
    batteryWidget.setPosition(75, 225);
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

    // Position the window in the top left corner with a margin
    deviceCareWidget.setPosition(75, 375);
    deviceCareWidget.setIgnoreMouseEvents(true)
});

try {
    require('electron-reloader')(module)
} catch (_) { }