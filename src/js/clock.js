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
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    // check if text should be white or black
    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'black' : 'var(--text)';
    const secondaryColor = backgroundLuminance > 128 ? 'var(--secondary-darker)' : 'var(--secondary-lighter)';

    document.getElementById('date').style.color = secondaryColor;
    containerMain.style.color = textColor;

    function getOrdinalSuffix(number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    function setTimeDate() {
        const currentDate = new Date();
        const time = currentDate.getHours() + ":" + currentDate.getMinutes()
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",];
        const date = dayNames[currentDate.getDay()] + ", " + getOrdinalSuffix(currentDate.getDate()) + " " + monthNames[currentDate.getMonth()]
        
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time;
    }

    setTimeDate()
    setInterval(setTimeDate, 1000)
})