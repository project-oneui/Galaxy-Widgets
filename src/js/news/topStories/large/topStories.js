window.addEventListener('DOMContentLoaded', () => {
    async function setStories() {
        const responseNews = await fetch('https://api.thenewsapi.com/v1/news/top?api_token=bAFIdJuWj1UamImTrPz8wsmSgyeEGDqotzmogoHW&locale=us&limit=3');
        const newsData = await responseNews.json();

        const newsTitles = document.getElementsByClassName("news-title");
        const newsCovers = document.getElementsByClassName("news-cover");
        
        for (let i = 0; i < 3; i++) {
            newsTitles[i].innerHTML = newsData.data[i].title;
            newsCovers[i].src = newsData.data[i].image_url
        }
    }

    setStories()
})
