const os = require('os');
const fs = require('fs');
const path = require('path');
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');
const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

window.addEventListener("DOMContentLoaded", () => {
    const containerMain = document.getElementById("container-main");

    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.background.red}, ${colorData.background.green}, ${colorData.background.blue}) 0%, rgb(${colorData.background.red - 15}, ${colorData.background.green - 15}, ${colorData.background.blue - 15}) 100%)`;

    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '../../css/colors.css';

    // Append the link element to the head of the document
    document.head.appendChild(linkElement);

    // Wait for the CSS file to be loaded
    linkElement.onload = function () {
        // Access the CSSStyleSheet object of the loaded CSS file
        var styleSheet = linkElement.sheet || linkElement.styleSheet;

        // Check if the stylesheet is accessible
        if (styleSheet) {
            // Calculate the inverse of the text color
            const inverseTextColor = {
                red: 255 - colorData.text.red,
                green: 255 - colorData.text.green,
                blue: 255 - colorData.text.blue
            };

            // Define the CSS rules for variables with RGB values, including the inverse text color
            var cssRules = [
                `--text: rgb(${colorData.text.red}, ${colorData.text.green}, ${colorData.text.blue})`,
                `--inverse-text: rgb(${inverseTextColor.red}, ${inverseTextColor.green}, ${inverseTextColor.blue})`,
                `--secondary: rgb(${colorData.secondary.red}, ${colorData.secondary.green}, ${colorData.secondary.blue})`,
                `--primary: rgb(${colorData.primary.red}, ${colorData.primary.green}, ${colorData.primary.blue})`
            ];

            // Add the CSS rules to the stylesheet
            cssRules.forEach(function (rule) {
                styleSheet.insertRule(':root {' + rule + ';}', styleSheet.cssRules.length);
            });

            // Now, the variables '--text', '--inverse-text', '--secondary', and '--primary' with the RGB values are added to the CSS
        }
    };
});
