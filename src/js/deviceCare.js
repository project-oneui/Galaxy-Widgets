const os = require('os')
const fs = require('fs')
const path = require('path')
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");
    // Check its not black
    if (colorData.red != 8) {
        containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;
    } else {
        containerMain.style.backgroundColor = '#080808'
    }

    // check if text should be white or black
    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'black' : 'var(--text)';
    const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-darker)' : 'var(--secondary-lighter)';

    const infoExisting = document.getElementsByClassName('info-existing')

    for (let i = 0; i < infoExisting.length; i++) {
        infoExisting[i].style.color = secondaryColor;
    }

    const infoProgressbar = document.getElementsByClassName('info-progressbar')

    for (let i = 0; i < infoProgressbar.length; i++) {
        infoProgressbar[i].style.backgroundColor = secondaryColor;
    }

    containerMain.style.color = textColor;

    function setDeviceCareInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\temp', '\\deviceCareInfo.json', 'utf8'));
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
