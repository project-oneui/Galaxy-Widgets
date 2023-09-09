const Vibrant = require('node-vibrant')
const os = require('os');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'OneUI-Widgets', 'temp');


window.addEventListener("DOMContentLoaded", () => {
    function setInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\songInfo.json', 'utf8'));
        
        if (jsonData.CoverUrl == "") {
            document.getElementById("music-cover").src = "../res/generic-cover.png";
        } else {
            Vibrant.from(jsonData.CoverUrl).getPalette()
                .then((palette) => {
                    const LightRGB = palette.DarkVibrant._rgb;
                    document.getElementById("container-main").style.background = `linear-gradient(180deg, rgba(${LightRGB[0]}, ${LightRGB[1]}, ${LightRGB[2]}, 1) 0%, rgba(${LightRGB[0] - 25}, ${LightRGB[1] - 25}, ${LightRGB[2] - 25}, 1) 100%)`
                })
            document.getElementById("music-cover").src = jsonData.CoverUrl;
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

