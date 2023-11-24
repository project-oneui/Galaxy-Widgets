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
            document.getElementById("music-cover").src = "../../../../res/generic-cover.png";

            musicArtists.style.color = 'var(--secondary)'
            musicTitle.style.color = 'var(--text)'
        } else {
            document.getElementById("music-cover").src = jsonData.CoverUrl + "?" + Date.now();
        }

        if (jsonData.Title == "") {
            document.getElementById("music-title").innerHTML = "No Song found";
        } else {
            document.getElementById("music-title").innerHTML = jsonData.Title;
        }
        document.getElementById("music-artists").innerHTML = jsonData.Artist;
    }

    setInfo();
    setInterval(setInfo, 500)

});

