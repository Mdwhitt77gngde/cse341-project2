const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const cursor = await mongodb.getDatabase().db().collection('authors').find();
    const authors = await cursor.toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(authors);
  } catch (err) {
    console.error('getAll authors error:', err);
    return res.status(500).json({ message: 'Could not get authors.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const author = await mongodb.getDatabase().db().collection('authors').findOne({ _id: new ObjectId(id) });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    return res.status(200).json(author);
  } catch (err) {
    console.error('getSingle author error:', err);
    return res.status(500).json({ message: 'Could not get author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const body = req.body;
    if (!body.firstName || !body.lastName) return res.status(400).json({ message: 'Missing required fields' });

    const author = {
      firstName: body.firstName,
      lastName: body.lastName,
      bio: body.bio || '',
      birthdate: body.birthdate || '',
      nationality: body.nationality || ''
    };

    const response = await mongodb.getDatabase().db().collection('authors').insertOne(author);
    if (response.acknowledged) return res.status(201).json({ id: response.insertedId });
    return res.status(500).json({ message: 'Could not create author' });
  } catch (err) {
    console.error('createAuthor error:', err);
    return res.status(500).json({ message: 'Could not create author' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const update = req.body;
    if (!update || Object.keys(update).length === 0) return res.status(400).json({ message: 'Missing request body' });
    const response = await mongodb.getDatabase().db().collection('authors').updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (response.matchedCount === 0) return res.status(404).json({ message: 'Author not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('updateAuthor error:', err);
    return res.status(500).json({ message: 'Could not update author' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const response = await mongodb.getDatabase().db().collection('authors').deleteOne({ _id: new ObjectId(id) });
    if (response.deletedCount === 0) return res.status(404).json({ message: 'Author not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteAuthor error:', err);
    return res.status(500).json({ message: 'Could not delete author' });
  }
};

module.exports = {
  getAll, getSingle, createAuthor, updateAuthor, deleteAuthor
};
