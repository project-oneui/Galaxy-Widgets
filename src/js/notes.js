const os = require('os')
const fs = require('fs')
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");

    const textarea = document.querySelector('textarea')

    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    // check if text should be white or black
    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'var(--text)' : 'black';
    const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-lighter)' : 'var(--secondary-darker)';

    containerMain.style.color = textColor;
    textarea.style.color = textColor;

    // Create a new style rule for textarea::placeholder
    const styleSheet = document.styleSheets[0]; // You might need to adjust the index based on your stylesheet
    const rule = `textarea::placeholder { color: ${secondaryColor}; }`; // Change the color to your desired placeholder color

    // Insert the new style rule into the stylesheet
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
})