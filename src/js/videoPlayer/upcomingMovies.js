const os = require('os')
const fs = require('fs')
const path = require('path');
const contrast = require('wcag-contrast')

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    const containerMain = document.getElementById("container-main");

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    function findBetterContrast(rgb1, rgb2) {
        const contrast1 = contrast.rgb(rgb1, [colorData.red, colorData.green, colorData.blue])
        const contrast2 = contrast.rgb(rgb2, [colorData.red, colorData.green, colorData.blue])
        if (contrast1 > contrast2) {
            return `rgb(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]})`;
        } else {
            return `rgb(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]})`;
        }
    }

    const textColor = findBetterContrast(textColors[0], textColors[1])
    const secondaryColor = findBetterContrast(secondaryColors[0], secondaryColors[1])

    containerMain.style.color = textColor;

    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    async function setMovies() {
        const posters = document.getElementsByClassName('poster')
        const names = document.getElementsByClassName('name')

        const movieResponse = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTJlZTcyZjhkYjRhMWQyMTgwY2Q1YzUzM2E0ODlhMCIsInN1YiI6IjY1MjZhMzJmZmQ2MzAwNWQ3OGQ3ODY2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TyvVBN5Lw6lp84n-hoTrhLBQMsad92mmuBZ7RU4Ir7A"
            }
        })

        const movieData = await movieResponse.json()

        for (i = 0; i < 4; i++) {
            names[i].innerHTML = movieData.results[i].title
            posters[i].src = `https://image.tmdb.org/t/p/original${movieData.results[i].poster_path}`
            console.log(`https://image.tmdb.org/t/p/original${movieData.results[i].poster_path}`)
        }
    }
    setMovies()
})