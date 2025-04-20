const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const API_URL = 'http://localhost:3333/api/books';

const bookDetails = document.getElementById('bookDetails');
const commentForm = document.getElementById('commentForm');
const commentList = document.getElementById('commentList');

// Mostrar detalhes do livro
fetch(`${API_URL}/${id}`)
  .then(res => res.json())
  .then(book => {
    bookDetails.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.image}" alt="${book.title}" style="max-width:200px" />
      <p><strong>Autor:</strong> ${book.author}</p>
      <p>${book.description}</p>
      <p><strong>Lançamento:</strong> ${new Date(book.releaseDate).toLocaleDateString()}</p>
    `;
  });

// Carregar comentários
function loadComments() {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(book => {
      commentList.innerHTML = '';
      book.comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `
          <p>${new Date(comment.date).toLocaleDateString()}: ${comment.text}</p>
          <button onclick="editComment('${comment._id}')">Editar</button>
          <button onclick="deleteComment('${comment._id}')">Excluir</button>
        `;
        commentList.appendChild(div);
      });
    });
}

// Adicionar comentário
commentForm.onsubmit = (e) => {
  e.preventDefault();
  const text = document.getElementById('commentInput').value.trim();
  if (!text) return;

  fetch(`${API_URL}/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('commentInput').value = '';
      loadComments();
    });
};

// Editar comentário
window.editComment = function(commentId) {
  const newText = prompt('Novo texto do comentário:');
  if (!newText) return;

  fetch(`${API_URL}/${id}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newText }),
  })
    .then(() => loadComments());
};

// Excluir comentário
window.deleteComment = function(commentId) {
  if (!confirm('Deseja excluir este comentário?')) return;

  fetch(`${API_URL}/${id}/comments/${commentId}`, {
    method: 'DELETE',
  })
    .then(() => loadComments());
};

// Carregar comentários ao abrir a página
loadComments();
