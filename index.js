const API_KEY = '39207240-5c487a84c917432aa28d0bb48';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  page = 1; 
  gallery.innerHTML = ''; 
  const query = e.target.query.value;
  currentQuery = query;
  fetchImages(query, page);
});

loadMoreButton.addEventListener('click', () => {
  page++;
  fetchImages(currentQuery, page);
});

async function fetchImages(query, page) {
  try {
    const response = await fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`
    );
    const data = await response.json();
    if (data.hits.length === 0) {
     
      alert('No images found.');
      return;
    }
    renderImages(data.hits);
    scrollIntoView();
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function renderImages(images) {
  images.forEach((image) => {
    const card = createImageCard(image);
    gallery.appendChild(card);
  });
}

function createImageCard(imageData) {
  const card = document.createElement('li');
  card.classList.add('photo-card');
  const image = document.createElement('img');
  image.src = imageData.webformatURL;
  image.alt = imageData.tags;
  const stats = document.createElement('div');
  stats.classList.add('stats');
  const likes = createStatsItem('thumb_up', imageData.likes);
  const views = createStatsItem('visibility', imageData.views);
  const comments = createStatsItem('comment', imageData.comments);
  const downloads = createStatsItem('cloud_download', imageData.downloads);

  stats.appendChild(likes);
  stats.appendChild(views);
  stats.appendChild(comments);
  stats.appendChild(downloads);

  card.appendChild(image);
  card.appendChild(stats);

  return card;
}

function createStatsItem(iconName, value) {
  const item = document.createElement('p');
  item.classList.add('stats-item');
  const icon = document.createElement('i');
  icon.classList.add('material-icons');
  icon.textContent = iconName;
  item.appendChild(icon);
  item.innerHTML += value;
  return item;
}

function scrollIntoView() {
  const element = loadMoreButton;
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
