const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const cursor = await mongodb.getDatabase().db().collection('books').find();
    const books = await cursor.toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(books);
  } catch (err) {
    console.error('getAll books error:', err);
    return res.status(500).json({ message: 'Could not get books.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const book = await mongodb.getDatabase().db().collection('books').findOne({ _id: new ObjectId(id) });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    return res.status(200).json(book);
  } catch (err) {
    console.error('getSingle book error:', err);
    return res.status(500).json({ message: 'Could not get book.' });
  }
};

const createBook = async (req, res) => {
  try {
    const body = req.body;
    const required = ['title', 'authorId', 'isbn'];
    for (const f of required) {
      if (!body[f]) return res.status(400).json({ message: `Missing required field: ${f}` });
    }
    if (!ObjectId.isValid(body.authorId)) return res.status(400).json({ message: 'Invalid authorId' });

    const book = {
      title: body.title,
      authorId: new ObjectId(body.authorId),
      isbn: body.isbn,
      publisher: body.publisher || '',
      publishedDate: body.publishedDate || '',
      pages: body.pages ? Number(body.pages) : null,
      genre: body.genre || '',
      summary: body.summary || ''
    };

    const response = await mongodb.getDatabase().db().collection('books').insertOne(book);
    if (response.acknowledged) return res.status(201).json({ id: response.insertedId });
    return res.status(500).json({ message: 'Could not create book' });
  } catch (err) {
    console.error('createBook error:', err);
    return res.status(500).json({ message: 'Could not create book' });
  }
};

const updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const update = req.body;
    if (!update || Object.keys(update).length === 0) return res.status(400).json({ message: 'Missing request body' });

    if (update.authorId) {
      if (!ObjectId.isValid(update.authorId)) return res.status(400).json({ message: 'Invalid authorId' });
      update.authorId = new ObjectId(update.authorId);
    }

    const response = await mongodb.getDatabase().db().collection('books').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (response.matchedCount === 0) return res.status(404).json({ message: 'Book not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('updateBook error:', err);
    return res.status(500).json({ message: 'Could not update book' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: new ObjectId(id) });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'Book not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteBook error:', err);
    return res.status(500).json({ message: 'Could not delete book' });
  }
};

module.exports = {
  getAll, getSingle, createBook, updateBook, deleteBook
};
