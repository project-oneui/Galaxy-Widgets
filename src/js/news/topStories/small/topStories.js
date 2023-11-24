window.addEventListener('DOMContentLoaded', () => {
    async function setStories() {
        const responseNews = await fetch('https://api.thenewsapi.com/v1/news/top?api_token=QflM8SvE3HSandQAItjchgrDupdbeaKAdwYCqeUn&locale=us&limit=1');
        const newsData = await responseNews.json();

        const newsSource = document.getElementsByClassName("news-source");
        const newsTitle = document.getElementsByClassName("news-title");
        const containerMain = document.getElementById("container-main");
        
        newsSource[0].innerHTML = newsData.data[0].source;
        newsTitle[0].innerHTML = newsData.data[0].title;
        containerMain.style.backgroundImage = `url(${newsData.data[0].image_url})`
        containerMain.style.backgroundSize = 'cover'
        containerMain.style.backgroundRepeat = 'no-repeat'
    }

    setStories()
})
