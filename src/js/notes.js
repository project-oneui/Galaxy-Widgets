const os = require('os')
const fs = require('fs')
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");

    const day = document.getElementsByClassName('day')
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
    // const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-darker)' : 'var(--secondary-lighter)';

    containerMain.style.color = textColor;
})