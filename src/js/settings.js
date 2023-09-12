const fs = require('fs');
const os = require('os');
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'OneUI-Widgets');
const jsonFilePath = path.join(folderPath, 'widgetStates.json');

window.addEventListener('DOMContentLoaded', () => {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    function updateWidgetState(widgetName, checkbox) {
        jsonData[widgetName].show = checkbox.checked.toString();
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 4), 'utf8');
    }

    const checkboxes = [
        { name: 'musicWidget', element: document.getElementById('music-checkbox') },
        { name: 'batteryWidget', element: document.getElementById('battery-checkbox') },
        { name: 'deviceCareWidget', element: document.getElementById('deviceCare-checkbox') },
        { name: 'weatherWidget', element: document.getElementById('weather-checkbox') },
        { name: 'newsWidget', element: document.getElementById('news-checkbox') },
        { name: 'flightWidget', element: document.getElementById('flight-checkbox') },
        { name: 'calendarWidget', element: document.getElementById('calendar-checkbox') },
    ];

    checkboxes.forEach((checkbox) => {
        checkbox.element.checked = jsonData[checkbox.name].show === 'true';

        checkbox.element.addEventListener('change', (event) => {
            updateWidgetState(checkbox.name, event.target);
        });
    });
});
