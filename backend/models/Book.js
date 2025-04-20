const mongoose = require('mongoose');

// Esquema para comentários
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Texto do comentário
  date: { type: Date, default: Date.now } // Data do comentário
});

// Esquema para livros
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, trim: true }, // Adicionado trim para remover espaços extras
  description: { type: String, trim: true },
  releaseDate: { type: Date },
  image: { type: String, trim: true },
  comments: [commentSchema], // Adicionado subdocumentos para comentários
  createdAt: { type: Date, default: Date.now }
});

// Exportando o modelo
module.exports = mongoose.model('Book', bookSchema);