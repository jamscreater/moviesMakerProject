
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzBmNjVhOTExY2QyZjQ1NzUxOGM3NDkyZGI1ZTkxYiIsIm5iZiI6MTcyOTA2Nzg3OS4yOTAwMDIsInN1YiI6IjY3MGY1NzVkMDQzMzFkYjRiMTEyNmExNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WGEa_aKhRLLw6_nAPqeKAikl0JEqNHEDM1AtEdKR7ZM'
    }
  };

let allMovies = [];  // 영화 데이터를 저장할 배열

// API에서 영화 데이터를 받아와서 카드 형태로 출력하는 함수
async function fetchMovies() {
    const apiUrl = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';  
    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        allMovies = data.results;  // 전체 영화 데이터를 저장
        displayMovies(allMovies);  // 모든 영화를 처음에 출력
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

// 받아온 영화 데이터를 화면에 출력하는 함수
function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // TMDb API에서 제공하는 이미지 URL은 기본 경로가 필요
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`  // 이미지 URL
            : 'https://via.placeholder.com/500x750?text=No+Image';  // 이미지가 없을 때 대체 이미지

        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${posterUrl}" alt="${movie.title} 포스터">
            </div>
            <div class="movie-info">
                <h2 class="movie-title">${movie.title}</h2>
                <p class="movie-summary">${movie.overview}</p>
                <p class="movie-rating">평점: ${movie.vote_average}/10</p>
            </div>
        `;
        movieCard.addEventListener('click', () => openModal(movie));  // 클릭 시 모달 열기
        movieContainer.appendChild(movieCard);
    });
}

// 실시간으로 영화 리스트를 필터링하는 함수
function filterMovies(keyword) {
    const filteredMovies = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(keyword.toLowerCase())  // 대소문자 구분 없이 검색
    );
    displayMovies(filteredMovies);  // 필터링된 영화만 출력
}

// 검색창에서 키 입력이 있을 때마다 실시간으로 필터링
document.getElementById('search-input').addEventListener('input', (e) => {
    const keyword = e.target.value;
    filterMovies(keyword);
});

// 모달 관련 코드
const modal = document.getElementById('movie-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalSummary = document.getElementById('modal-summary');
const modalRating = document.getElementById('modal-rating');
const closeModal = document.querySelector('.close');

// 영화 카드를 클릭했을 때 모달을 띄우는 함수
function openModal(movie) {
    modalPoster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';
    modalTitle.textContent = movie.title;
    modalSummary.textContent = movie.overview;
    modalRating.textContent = `평점: ${movie.vote_average}/10`;

    modal.style.display = 'flex';  // 모달을 보이도록 설정
}

// 모달을 닫는 함수
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달 외부를 클릭했을 때 모달 닫기
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 페이지가 로드되면 영화 데이터를 가져와서 출력
fetchMovies();
