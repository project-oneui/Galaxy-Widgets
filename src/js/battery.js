const battery = require("battery");
const os = require('os')
const fs = require('fs')
const path = require('path');
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

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
    const textColor = backgroundLuminance > 128 ? 'black' : 'var(--text)';
    const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-lighter)' : 'var(--secondary-darker)';


    containerMain.style.color = textColor;

    const deviceProgressbar = document.getElementsByClassName('device-progressbar')

    for (let i = 0; i < deviceProgressbar.length; i++) {
        deviceProgressbar[i].style.backgroundColor = secondaryColor;
    }

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

    const phonePath = path.join(folderPath, 'temp', "batteryPhoneInfo.json");

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

    const tabletPath = path.join(folderPath, 'temp', "batteryTabletInfo.json");
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