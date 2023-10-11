const os = require('os')
const fs = require('fs')
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

window.addEventListener('DOMContentLoaded', () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");

    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    // check if text should be white or black
    function getLuminance(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const backgroundLuminance = getLuminance(colorData.red, colorData.green, colorData.blue);
    const textColor = backgroundLuminance > 128 ? 'var(--text)' : 'black';

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
