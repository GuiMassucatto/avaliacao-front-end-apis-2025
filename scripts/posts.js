const listaPosts = document.getElementById("lista-posts");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("postModal");
const modalTitle = document.getElementById("modalPostTitle");
const modalContent = document.getElementById("modalPostContent");
const modalCloseBtn = modal.querySelector(".modal-close-button");
const logoutBtn = document.getElementById("logout-btn");
const nomeUsuarioHeader = document.getElementById("nomeUsuarioHeader");

let posts = [];
let usuarioLogado = null;

function mostrarErro(msg) {
  listaPosts.innerHTML = `<p style="color:red">${msg}</p>`;
}

function checarLogin() {
  const userStr = localStorage.getItem("user");
  const expiresAtStr = localStorage.getItem("expiresAt");

  if (!userStr || !expiresAtStr) {
    window.location.href = "login.html";
    return false;
  }

  const expiresAt = parseInt(expiresAtStr);
  if (Date.now() > expiresAt) {
    localStorage.clear();
    window.location.href = "login.html";
    return false;
  }

  usuarioLogado = JSON.parse(userStr);
  nomeUsuarioHeader.textContent = usuarioLogado.username || usuarioLogado.user?.username || "Usuário";

  return true;
}

function checarSessaoPeriodicamente() {
  setInterval(() => {
    const expiresAtStr = localStorage.getItem("expiresAt");
    if (!expiresAtStr) return;

    const expiresAt = parseInt(expiresAtStr);

    if (Date.now() > expiresAt) {
      alert("Sua sessão expirou! Faça login novamente.");
      localStorage.clear();
      window.location.href = "login.html";
    }
  }, 1000);
}

async function carregarPosts() {
  try {
    listaPosts.innerHTML = "Carregando posts...";
    const res = await fetch("https://dummyjson.com/posts");
    if (!res.ok) throw new Error("Erro ao carregar posts");
    const data = await res.json();
    posts = data.posts;
    exibirPosts(posts);
  } catch (error) {
    mostrarErro("Não foi possível carregar os posts.");
    console.error(error);
  }
}

function exibirPosts(postsParaMostrar) {
  if (postsParaMostrar.length === 0) {
    listaPosts.innerHTML = "<p>Nenhum post encontrado.</p>";
    return;
  }

  listaPosts.innerHTML = "";
  postsParaMostrar.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("card-post");

    const titulo = document.createElement("h2");
    titulo.textContent = post.title;

    const corpo = document.createElement("p");
    corpo.textContent = post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;

    card.appendChild(titulo);
    card.appendChild(corpo);

    card.tabIndex = 0; 
    card.setAttribute("role", "button");

    card.addEventListener("click", () => abrirModal(post));
    card.addEventListener("keypress", e => {
      if (e.key === "Enter" || e.key === " ") abrirModal(post);
    });

    listaPosts.appendChild(card);
  });
}

function abrirModal(post) {
  modalTitle.textContent = post.title;
  modalContent.textContent = post.body;
  modal.classList.add("show");
}

modalCloseBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();
  const filtrados = posts.filter(p => p.title.toLowerCase().includes(termo));
  exibirPosts(filtrados);
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

if (checarLogin()) {
  carregarPosts();
  checarSessaoPeriodicamente();
}
