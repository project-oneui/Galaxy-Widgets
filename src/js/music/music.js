const Vibrant = require('node-vibrant')
const os = require('os');
const fs = require('fs');
const path = require('path');
const { json } = require('body-parser');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));
    const containerMain = document.getElementById("container-main");


    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'black' : 'var(--text)';

    var progressBar = document.querySelector('progressbar');
    containerMain.style.color = textColor;

    function setInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\temp\\songInfo.json', 'utf8'));

        if (jsonData.CoverUrl == "") {
            containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;
            document.getElementById("music-cover").src = "../../res/generic-cover.png";
        } else {
            document.getElementById("music-cover").src = jsonData.CoverUrl + "?" + Date.now();
            Vibrant.from(jsonData.CoverUrl).getPalette()
                .then((palette) => {
                    const LightRGB = palette.DarkVibrant._rgb;
                    document.getElementById("container-main").style.background = `linear-gradient(135deg, rgba(${LightRGB[0]}, ${LightRGB[1]}, ${LightRGB[2]}, 1) 0%, rgba(${LightRGB[0] - 25}, ${LightRGB[1] - 25}, ${LightRGB[2] - 25}, 1) 100%)`

                    const gradientLuminance = getLuminance(LightRGB[0] , LightRGB[1], LightRGB[2]);
                    const gradientTextColor = gradientLuminance < 128 ? 'var(--text)' : 'black'

                    const gradientSecondaryColor = 'var(--secondary-lighter)';

                    const musicArtists = document.getElementById('music-artists');
                    const musicTitle = document.getElementById('music-title')
                    const musicPosition = document.getElementById("music-position");
                    const musicDuration = document.getElementById("music-duration")
                    const title = document.getElementById("music-title")

                    musicArtists.style.color = gradientSecondaryColor;
                    musicTitle.style.color = gradientTextColor;
                    musicPosition.style.color = gradientSecondaryColor;
                    musicDuration.style.color = gradientSecondaryColor;
                    progressBar.style.backgroundColor = gradientSecondaryColor;
                    title.style.color = gradientTextColor;
                    console.log()
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

