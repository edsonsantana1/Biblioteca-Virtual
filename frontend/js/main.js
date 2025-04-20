const bookList = document.getElementById('bookList');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let currentSearch = '';

// Use URL absoluta para integração com o backend
const API_URL = 'http://localhost:3333/api/books'; // Ajuste para corresponder ao backend

function fetchBooks(page = 1, search = '') {
  // Busca livros com paginação e filtro por busca
  fetch(`${API_URL}?q=${search}&page=${page}&limit=3`) // Adiciona parâmetro limit=3
    .then(res => {
      if (!res.ok) {
        throw new Error('Erro ao buscar livros');
      }
      return res.json();
    })
    .then(data => {
      renderBooks(data.books);
      renderPagination(data.totalPages);
    })
    .catch(err => {
      console.error(err.message);
      bookList.innerHTML = '<p class="error">Erro ao carregar livros. Tente novamente mais tarde.</p>';
    });
}

function renderBooks(books) {
  // Renderiza a lista de livros na página
  bookList.innerHTML = books.map(book => `
    <div class="book-item" onclick="location.href='book.html?id=${book._id}'">
      <div class="book-visual">
        <img src="${book.image}" alt="Capa do livro ${book.title}">
        <h2>${book.title}</h2>
      </div>
    </div>
  `).join('');
}

function renderPagination(totalPages) {
  // Renderiza os botões de paginação
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }
}

function changePage(page) {
  // Altera a página atual e busca livros
  currentPage = page;
  fetchBooks(currentPage, currentSearch);
}

// Escuta o campo de busca para atualizar a lista de livros
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  fetchBooks(1, currentSearch); // Reinicia para a página 1 ao buscar
});

// Redireciona para a página de adicionar novo livro
document.getElementById('addBookBtn').onclick = () => {
  location.href = 'add.html';
};

// Realiza a busca inicial dos livros na carga da página
fetchBooks();