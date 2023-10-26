window.addEventListener('DOMContentLoaded', () => {
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
