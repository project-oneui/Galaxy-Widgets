const battery = require("battery");
const os = require('os')
const fs = require('fs')
const path = require('path');
const { json } = require("body-parser");
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets', 'temp');

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("device-name-notebook").innerHTML = os.hostname();

    async function setNotebookInfo() {
        try {
            (async () => {
                const { level } = await battery();
                const percentage = level * 100 + "%";
                document.getElementById("device-percentage-notebook").innerHTML = percentage;
                document.getElementById("device-progress-notebook").style.width = percentage;
            })();
        } catch { }
    }

    const phonePath = path.join(folderPath, "batteryPhoneInfo.json");

    function setPhoneInfo() {
        if (!fs.existsSync(phonePath)) {
            document.getElementById("container-device-phone").style.position = "absolute";
            document.getElementById("container-device-phone").style.opacity = "0";
        } else {
            document.getElementById("container-device-phone").style.position = "relative";
            document.getElementById("container-device-phone").style.opacity = "1";
            const jsonData = JSON.parse(fs.readFileSync(phonePath, 'utf8'));
            const percentage = jsonData.battery_percentage + "%";
            document.getElementById("device-name-phone").innerHTML = jsonData.phone_name;
            document.getElementById("device-percentage-phone").innerHTML = percentage;
            document.getElementById("device-progress-phone").style.width = percentage;
        }
    }

    const tabletPath = path.join(folderPath, "batteryTabletInfo.json");
    function setTabletInfo() {
        if (!fs.existsSync(tabletPath)) {
            document.getElementById("container-device-tablet").style.position = "absolute";
            document.getElementById("container-device-tablet").style.opacity = "0";
        } else {
            document.getElementById("container-device-tablet").style.position = "relative";
            document.getElementById("container-device-tablet").style.opacity = "1";
            const jsonData = JSON.parse(fs.readFileSync(tabletPath, 'utf8'));
            const percentage = jsonData.battery_percentage + "%";
            document.getElementById("device-name-tablet").innerHTML = jsonData.tablet_name;
            document.getElementById("device-percentage-tablet").innerHTML = percentage;
            document.getElementById("device-progress-tablet").style.width = percentage;
        }
    }

    setPhoneInfo()
    setNotebookInfo();
    setTabletInfo();
    setInterval(setNotebookInfo, 1000 * 10)
    setInterval(setPhoneInfo, 1000 * 10)
    setInterval(setTabletInfo, 1000 * 10)

})