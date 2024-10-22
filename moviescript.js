const API_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_PATH = 'https://image.tmdb.org/t/p/w500';
const options = {
 method: 'GET',
 headers: {
   accept: 'application/json',
   Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzBmNjVhOTExY2QyZjQ1NzUxOGM3NDkyZGI1ZTkxYiIsIm5iZiI6MTcyOTYzOTcyNS43OTY5MTQsInN1YiI6IjY3MGY1NzVkMDQzMzFkYjRiMTEyNmExNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._lHexjZWu7Ko2JnQCjZcJ1uIpYI048x2N2LT0LgeTRc' // 본인의 Bearer 토큰을 입력하세요
 }
};

// DOM elements
const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalPoster = document.getElementById('modal-poster');
const modalOverview = document.getElementById('modal-overview');
const modalReleaseDate = document.getElementById('modal-release-date');
const modalRating = document.getElementById('modal-rating');
const closeButton = document.querySelector('.close-button');

// Close the modal when the close button is clicked
closeButton.addEventListener('click', () => {
 modal.style.display = 'none';
});

// Fetch popular movies (trending for the day) from TMDB API
function fetchPopularMovies() {
 fetch(`${API_BASE_URL}/trending/movie/day?language=en-US`, options)
   .then(response => response.json())
   .then(data => displayMovies(data.results))
   .catch(error => console.error('Error fetching movies:', error));
}

// Display movies on the page
function displayMovies(movies) {
 movieContainer.innerHTML = ''; // Clear previous content

 movies.forEach(movie => {
   const movieCard = document.createElement('div');
   movieCard.classList.add('movie-card');
   movieCard.innerHTML = `
     <img src="${POSTER_PATH + movie.poster_path}" alt="${movie.title}">
     <h3>${movie.title}</h3>
     <p>${movie.overview.substring(0, 100)}...</p>
     <p><strong>Rating:</strong> ${movie.vote_average}</p>
   `;
   // Add click event to show movie details in a modal
   movieCard.addEventListener('click', () => showMovieDetails(movie.id));
   movieContainer.appendChild(movieCard);
 });
}

// Show movie details in a modal
function showMovieDetails(movieId) {
 fetch(`${API_BASE_URL}/movie/${movieId}`, options)
   .then(response => response.json())
   .then(movie => {
     modalTitle.innerText = movie.title;
     modalPoster.src = POSTER_PATH + movie.poster_path;
     modalOverview.innerText = movie.overview;
     modalReleaseDate.innerText = movie.release_date;
     modalRating.innerText = movie.vote_average;
     modal.style.display = 'flex'; // Display the modal
   })
   .catch(error => console.error('Error fetching movie details:', error));
}

// Filter movies based on search input
searchInput.addEventListener('input', function () {
 const keyword = searchInput.value.toLowerCase();

 if (keyword.trim() === '') {
   // If search input is empty, show popular movies again
   fetchPopularMovies();
 } else {
   fetch(`${API_BASE_URL}/search/movie?query=${keyword}&language=en-US`, options)
     .then(response => response.json())
     .then(data => displayMovies(data.results))
     .catch(error => console.error('Error searching movies:', error));
 }
});

// Initial fetch of popular movies when page loads
fetchPopularMovies();
