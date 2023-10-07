const Vibrant = require('node-vibrant')
const os = require('os');
const fs = require('fs');
const path = require('path');
const { json } = require('body-parser');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    var progressBar = document.querySelector('progressbar');
    progressBar.style.backgroundColor = secondaryColor;
    containerMain.style.color = textColor;

    function setInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\temp\\songInfo.json', 'utf8'));

        if (jsonData.CoverUrl == "") {
            containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;
            document.getElementById("music-cover").src = "../res/generic-cover.png";
        } else {
            document.getElementById("music-cover").src = jsonData.CoverUrl + "?" + Date.now();
            Vibrant.from(jsonData.CoverUrl).getPalette()
                .then((palette) => {
                    const LightRGB = palette.DarkVibrant._rgb;
                    document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(${LightRGB[0]}, ${LightRGB[1]}, ${LightRGB[2]}, 1) 0%, rgba(${LightRGB[0] - 25}, ${LightRGB[1] - 25}, ${LightRGB[2] - 25}, 1) 100%)`
                })
        }

        if (jsonData.Title == "") {
            document.getElementById("music-title").innerHTML = "No Song found";
        } else {
            document.getElementById("music-title").innerHTML = jsonData.Title;
        }
        document.getElementById("music-artists").innerHTML = jsonData.Artist;
        document.getElementById("music-position").innerHTML = jsonData.Position;
        document.getElementById("music-progress").style.width = jsonData.PositionPercent + "%";
        document.getElementById("music-duration").innerHTML = jsonData.Duration;
    }

    setInfo();
    setInterval(setInfo, 500)

});

