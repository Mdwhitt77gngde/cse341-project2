const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

router.get('/', booksController.getAll);
router.get('/:id', booksController.getSingle);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
