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
            document.getElementById("music-cover").src = "../../../../res/generic-cover.png";

            musicArtists.style.color = 'var(--secondary)'
            musicTitle.style.color = 'var(--text)'
            musicPosition.style.color = 'var(--secondary)';
            musicDuration.style.color = 'var(--secondary)';
        } else {
            document.getElementById("music-cover").src = jsonData.CoverUrl + "?" + Date.now();
            Vibrant.from(jsonData.CoverUrl).getPalette()
                .then((palette) => {
                    musicArtists.style.color = palette.Muted.hex;
                    musicTitle.style.color = palette.LightVibrant.hex;
                    musicPosition.style.color = palette.Muted.hex;
                    musicDuration.style.color = palette.Muted.hex;
                    // progress.style.backgroundColor = palette.LightVibrant.hex
                    progress.style.background = `linear-gradient(180deg, rgba(${palette.LightVibrant.r}, ${palette.LightVibrant.g}, ${palette.LightVibrant.b}, 1) 0%, rgba(${palette.LightVibrant.r - 32}, ${palette.LightVibrant.g - 32}, ${palette.LightVibrant.b - 32}, 1) 100%)`

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

