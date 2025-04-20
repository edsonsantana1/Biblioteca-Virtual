const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

// Rotas para livros
router.get('/', controller.getAllBooks);        // Listar livros com paginação e busca
router.get('/:id', controller.getBookById);    // Buscar detalhes de um livro
router.post('/', controller.addBook);          // Adicionar um novo livro
router.put('/:id', controller.updateBook);     // Atualizar um livro
router.delete('/:id', controller.deleteBook);  // Remover um livro

// Rotas para comentários
router.post('/:id/comments', controller.addComment); // Adicionar um comentário a um livro
router.put('/:bookId/comments/:commentId', controller.updateComment); // Atualizar um comentário específico
router.delete('/:bookId/comments/:commentId', controller.deleteComment); // Remover um comentário específico

module.exports = router;