const os = require('os')
const fs = require('fs')
const path = require('path')
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');
const contrast = require('wcag-contrast')

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");
    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

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

    const infoExisting = document.getElementsByClassName('info-existing')

    for (let i = 0; i < infoExisting.length; i++) {
        infoExisting[i].style.color = secondaryColor;
    }

    const infoProgressbar = document.getElementsByClassName('info-progressbar')
    const infoProgress = document.getElementsByClassName('info-progress')

    for (let i = 0; i < infoProgressbar.length; i++) {
        infoProgressbar[i].style.backgroundColor = secondaryColor;
        infoProgress[i].style.backgroundColor = textColor;
    }

    containerMain.style.color = textColor;

    function setDeviceCareInfo() {
        const jsonData = JSON.parse(fs.readFileSync(path.join(folderPath, 'temp', 'deviceCareInfo.json'), 'utf8'));
        document.getElementById("info-used-memory").innerHTML = ((os.totalmem() - os.freemem()) / 1073741824).toFixed(1) + "GB";
        document.getElementById("info-existing-memory").innerHTML = "/ " + (os.totalmem() / 1073741824).toFixed() + "GB";
        document.getElementById("info-progress-memory").style.width = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100 + "%";
        document.getElementById("info-used-storage").innerHTML = (jsonData.Used / 1073741824).toFixed(1) + "GB";
        document.getElementById("info-existing-storage").innerHTML = "/ " + (jsonData.Existing / 1073741824).toFixed() + "GB";
        document.getElementById("info-progress-storage").style.width = (jsonData.Used / jsonData.Existing) * 100 + "%";
    }

    setDeviceCareInfo();
    setInterval(setDeviceCareInfo, 1000 * 30)
})
