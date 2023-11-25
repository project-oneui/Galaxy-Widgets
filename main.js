const { app, BrowserWindow, Menu, Tray, ipcMain, webContents } = require('electron');
const Vibrant = require('node-vibrant');
const express = require('express');
const server = require('./src/js/battery-listener');
const jsonHandler = require('./jsonHandler');
const os = require('os')
const fs = require('fs')
const path = require('path');
const icon = __dirname + '/favicon.ico'
const { spawn } = require('child_process');

var movable = false;

// checks if the appExe is named electron so it doesn't autostart electron.exe while developing
if (!app.getPath('exe').includes('electron')) {
    // starts the app at login
    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath('exe')
    });
}

// starts the background Serivce which provides information for the music and device care widget
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
let digitalClockWidget = null;
let upcomingMoviesWidget = null;

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}


// info for widget windows
const widgetsData = {
    widgets: [
        // { name: "deviceCareWidget", width: 390, height: 125, html: "./src/widgets/deviceCare/deviceCare.html" },
        {
            name: "batteryWidget",
            clickthrough: true,
            sizes: {
                small: {
                    width: 175, height: 175, html: "./src/widgets/deviceCare/battery/small/battery.html"
                },
                medium: {
                    width: 390, height: 175, html: "./src/widgets/deviceCare/battery/medium/battery.html"
                }
            },
        },
        {
            name: "weatherWidget",
            clickthrough: true,
            sizes: {
                small: {
                    width: 175, height: 175, html: "./src/widgets/weather/weather/small/weather.html"
                },
                medium: {
                    width: 390, height: 175, html: "./src/widgets/weather/weather/medium/weather.html"
                }
            },
        },
        {
            name: "topStoriesWidget",
            clickthrough: true,
            sizes: {
                small: {
                    width: 175, height: 175, html: "./src/widgets/news/topStories/small/topStories.html"
                },
                medium: {
                    width: 390, height: 175, html: "./src/widgets/news/topStories/medium/topStories.html"
                },
                large: {
                    width: 390, height: 250, html: "./src/widgets/news/topStories/large/topStories.html"
                }
            }
        },
        {
            name: "musicWidget",
            clickthrough: true,
            sizes: {
                small: {
                    width: 175, height: 175, html: "./src/widgets/music/music/small/music.html"
                },
                medium: {
                    width: 390, height: 175, html: "./src/widgets/music/music/medium/music.html"
                }
            }
        }
        // { name: "flightWidget", width: 390, height: 175, html: "./src/widgets/wallet/flight.html" },
        // { name: "quickNotesWidget", width: 390, height: 175, html: "./src/widgets/notes/quickNotes.html", },
        // { name: "digitalClockWidget", width: 390, height: 100, html: "./src/widgets/clock/digitalClock.html" },
        // { name: "upcomingMoviesWidget", width: 390, height: 200, html: "./src/widgets/videoPlayer/upcomingMovies.html" },
    ],
};

app.on('ready', () => {
    hiddenWindow = new BrowserWindow({ show: false });
    // creates tray for quitting the app
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle movable', click: () => {
                movable = !movable; hiddenWindow.webContents.send('update-movable', movable); console.log(movable)
            }
        },
        { type: 'separator' },
        { label: 'Quit', click: () => { app.quit(); } } // Quit the app completely when clicked
    ]);
    tray.setToolTip('Galaxy Widgets')
    tray.setContextMenu(contextMenu)

    function setStates() {
        const widgetStates = JSON.parse(fs.readFileSync(folderPath + "\\widgetStates.json"))
        const widgetPositions = JSON.parse(fs.readFileSync(folderPath + "\\widgetPositions.json"))

        // goes through each widget
        widgetsData.widgets.forEach(widget => {
            // checks if the widget is enabled and if it doesnt exist (== null)
            if (widgetStates[widget.name].show == "true" && eval(widget.name) == null) {
                const widgetWindow = new BrowserWindow({
                    width: widget.sizes[widgetStates[widget.name].size].width,
                    height: widget.sizes[widgetStates[widget.name].size].height,
                    transparent: true,
                    frame: false,
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
                        width: widget.sizes[widgetStates[widget.name].size].width,
                        height: widget.sizes[widgetStates[widget.name].size].height,
                        x: parseInt(widgetPositions[widget.name].x),
                        y: parseInt(widgetPositions[widget.name].y)
                    });
                }

                widgetWindow.loadFile(path.join(__dirname, widget.sizes[widgetStates[widget.name].size].html));

                // sets the variable again to null when its closed
                widgetWindow.on('closed', () => {
                    eval(`${widget.name} = null`);
                });

                // fixes widget appearing in taskbar
                widgetWindow.on('focus', () => {
                    widgetWindow.setSkipTaskbar(true)
                });

                widgetWindow.on('moved', () => {
                    let roundedX, roundedY;

                    const currentPosition = widgetWindow.getPosition()
                    const currentX = currentPosition[0];
                    const currentY = currentPosition[1];

                    roundedX = Math.round(currentX / 25) * 25;
                    roundedY = Math.round(currentY / 25) * 25;

                    widgetPositions[widget.name].x = roundedX.toString();
                    widgetPositions[widget.name].y = roundedY.toString();
                    fs.writeFileSync(path.join(folderPath, 'widgetPositions.json'), JSON.stringify(widgetPositions, null, 4));

                    widgetWindow.setBounds({
                        width: widget.sizes[widgetStates[widget.name].size].width,
                        height: widget.sizes[widgetStates[widget.name].size].height,
                        x: roundedX,
                        y: roundedY
                    });
                });


            }
            // destroys window if it gets deactivated
            else if (widgetStates[widget.name].show != "true" && eval(widget.name) != null) {
                eval(`${widget.name}.destroy()`);
                eval(`${widget.name} = null`);

            }
            // fixes widget appearing in taskbar
            else if (widgetStates[widget.name].show == "true" && eval(widget.name) != null) {

                // check if current loaded html is the wanted size of widget
                if (!eval(`${widget.name}.webContents.getURL()`).includes(widgetStates[widget.name].size)) {
                    // change size
                    eval(`${widget.name}.setBounds({
                        width: ${widget.sizes[widgetStates[widget.name].size].width},  
                        height: ${widget.sizes[widgetStates[widget.name].size].height},  
                        x: parseInt(widgetPositions[widget.name].x),
                        y: parseInt(widgetPositions[widget.name].y), 
                    })`)

                    // change html
                    eval(`${widget.name}.loadFile(path.join(__dirname, widget.sizes[widgetStates[widget.name].size].html))`)
                }


                // widgetWindow.loadFile(path.join(__dirname, widget.sizes[widgetStates[widget.name].size].html));


                // eval(`${widget.name}.setIgnoreMouseEvents(${!movable})`)
                eval(`${widget.name}.setMovable(${movable})`)
            }
        });
    }

    setStates()
    setInterval(function () {
        setStates();
    }, 400);
});

// hot reloader for easier development
try {
    require('electron-reloader')(module)
} catch (_) { }