const Book = require('../models/Book');

// Listar livros com paginação e busca
exports.getAllBooks = async (req, res) => {
  try {
    const { q, page = 1, limit = 6 } = req.query;
    const query = q ? { title: { $regex: q, $options: 'i' } } : {};
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Book.countDocuments(query);
    res.json({ books, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar os livros.' });
  }
};

// Buscar detalhes de um livro (inclui comentários associados)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('comments'); // Popula os comentários
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o livro.' });
  }
};

// Adicionar um novo livro
exports.addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar o livro.' });
  }
};

// Atualizar um livro
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o livro.' });
  }
};

// Remover um livro
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json({ message: 'Livro removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o livro.' });
  }
};

// Adicionar comentário a um livro
exports.addComment = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });

    const comment = { text: req.body.text, date: new Date() };
    book.comments.push(comment);
    await book.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar o comentário.' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });

    const comment = book.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado.' });

    comment.text = req.body.text;
    await book.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o comentário.' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    console.log('Recebendo requisição para excluir comentário...');
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      console.error('Livro não encontrado:', req.params.bookId);
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    console.log('Livro encontrado:', book.title);

    const commentIndex = book.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      console.error('Comentário não encontrado:', req.params.commentId);
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    console.log('Comentário encontrado:', book.comments[commentIndex].text);

    // Remove o comentário manualmente
    book.comments.splice(commentIndex, 1);
    await book.save(); // Salva as alterações no banco

    console.log('Comentário removido com sucesso.');
    res.json({ message: 'Comentário removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover o comentário:', error);
    res.status(500).json({ error: 'Erro ao remover o comentário.' });
  }
};