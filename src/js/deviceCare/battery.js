const battery = require("battery");
const os = require('os')
const fs = require('fs')
const path = require('path');
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');
const contrast = require('wcag-contrast');
const { text } = require("body-parser");

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");
    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    // check if text should be white or black

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting

    function findBetterContrast(rgb1, rgb2) {
        const contrast1 = contrast.rgb(rgb1, [colorData.red, colorData.green, colorData.blue])
        const contrast2 = contrast.rgb(rgb2, [colorData.red, colorData.green, colorData.blue])
        if (contrast1 > contrast2) {
            return `rgb(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]})`;
        } else {
            return `rgb(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]})`;
        }
    }

    const textColor = findBetterContrast(textColors[0], textColors[1])
    const secondaryColor = findBetterContrast(secondaryColors[0], secondaryColors[1])

    containerMain.style.color = textColor;

    const deviceProgressbar = document.getElementsByClassName('device-progressbar')
    const deviceProgress = document.getElementsByClassName('device-progress')

    for (let i = 0; i < deviceProgressbar.length; i++) {
        deviceProgressbar[i].style.backgroundColor = secondaryColor;
        deviceProgress[i].style.backgroundColor = textColor;
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