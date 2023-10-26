const Vibrant = require('node-vibrant')

window.addEventListener("DOMContentLoaded", () => {
    const containerMain = document.getElementById('container-main')
    const musicArtists = document.getElementById('music-artists');
    const musicTitle = document.getElementById('music-title')
    const musicPosition = document.getElementById("music-position");
    const musicDuration = document.getElementById("music-duration")
    const progress = document.getElementById('music-progress');
    function setInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\temp\\songInfo.json', 'utf8'));

        if (jsonData.CoverUrl == "") {
            containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.background.red}, ${colorData.background.green}, ${colorData.background.blue}) 0%, rgb(${colorData.background.red - 15}, ${colorData.background.green - 15}, ${colorData.background.blue - 15}) 100%)`;
            document.getElementById("music-cover").src = "../../res/generic-cover.png";

            musicArtists.style.color = 'var(--secondary)'
            musicTitle.style.color = 'var(--text)'
            musicPosition.style.color = 'var(--secondary)';
            musicDuration.style.color = 'var(--secondary)';
        } else {
            document.getElementById("music-cover").src = jsonData.CoverUrl + "?" + Date.now();
            Vibrant.from(jsonData.CoverUrl).getPalette()
                .then((palette) => {
                    const darkVibrantRGB = palette.DarkVibrant._rgb;
                    document.getElementById("container-main").style.background = `linear-gradient(135deg, rgba(${darkVibrantRGB[0]}, ${darkVibrantRGB[1]}, ${darkVibrantRGB[2]}, 1) 0%, rgba(${darkVibrantRGB[0] - 25}, ${darkVibrantRGB[1] - 25}, ${darkVibrantRGB[2] - 25}, 1) 100%)`
                    musicArtists.style.color = palette.Muted.hex;
                    musicTitle.style.color = palette.LightVibrant.hex;
                    musicPosition.style.color = palette.Muted.hex;
                    musicDuration.style.color = palette.Muted.hex;
                    progress.style.backgroundColor = palette.LightVibrant.hex
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

