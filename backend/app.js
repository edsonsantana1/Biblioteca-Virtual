const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
mongoose.connect('mongodb://localhost:27017/bookdb'); // ou use MongoDB Atlas

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/books', bookRoutes);

module.exports = app;
