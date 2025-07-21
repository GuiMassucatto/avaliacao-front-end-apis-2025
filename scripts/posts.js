const token = localStorage.getItem('token');
if (!token) window.location.href = './login.html';

const postsContainer = document.getElementById('posts-container');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = './login.html';
});

let posts = [];

async function loadPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  posts = await res.json();
  renderPosts(posts);
}

function renderPosts(postList) {
  postsContainer.innerHTML = '';
  postList.forEach(post => {
    const card = document.createElement('div');
    card.className = 'card-post';
    card.textContent = post.title;
    card.addEventListener('click', () => showModal(post));
    postsContainer.appendChild(card);
  });
}

function showModal(post) {
  modalTitle.textContent = post.title;
  modalBody.textContent = post.body;
  modal.classList.remove('hidden');
}

modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = posts.filter(post => post.title.toLowerCase().includes(searchTerm));
  renderPosts(filtered);
});

loadPosts();