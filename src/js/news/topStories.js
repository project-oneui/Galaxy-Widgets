const os = require('os')
const fs = require('fs')
const path = require('path');
const contrast = require('wcag-contrast')

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener('DOMContentLoaded', () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");

    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting

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


    async function setStories() {
        const responseNews = await fetch('https://api.thenewsapi.com/v1/news/top?api_token=bAFIdJuWj1UamImTrPz8wsmSgyeEGDqotzmogoHW&locale=us&limit=2');
        const newsData = await responseNews.json();

        const newsTitles = document.getElementsByClassName("news-title");
        const newsCovers = document.getElementsByClassName("news-cover");
        
        newsTitles[0].innerHTML = newsData.data[0].title;
        newsCovers[0].src = newsData.data[0].image_url

        newsTitles[1].innerHTML = newsData.data[1].title;
        newsCovers[1].src = newsData.data[1].image_url
    }

    setStories()
})
