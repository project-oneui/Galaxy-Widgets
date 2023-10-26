window.addEventListener("DOMContentLoaded", () => {

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
        }
    }
    setMovies()
})