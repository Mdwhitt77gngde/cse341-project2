const mongodb = require('../data/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// helper: create token
const createToken = (user) => {
  return jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '8h' });
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });

    const db = mongodb.getDatabase().db();
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const userDoc = { email, password: hash, name: name || '', createdAt: new Date() };

    const result = await db.collection('users').insertOne(userDoc);
    if (!result.acknowledged) return res.status(500).json({ message: 'Could not create user' });

    const token = createToken({ _id: result.insertedId, email });
    return res.status(201).json({ id: result.insertedId, token });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });

    const db = mongodb.getDatabase().db();
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    return res.status(200).json({ token, id: user._id });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Called after successful GitHub auth by passport; request.user set by passport
const githubCallback = async (req, res) => {
  try {
    const githubProfile = req.user; // set in passport strategy
    const email = (githubProfile.emails && githubProfile.emails[0] && githubProfile.emails[0].value) || `${githubProfile.username}@github`;
    const db = mongodb.getDatabase().db();

    // find or create user
    let user = await db.collection('users').findOne({ githubId: githubProfile.id });
    if (!user) {
      const userDoc = {
        githubId: githubProfile.id,
        email,
        name: githubProfile.displayName || githubProfile.username,
        createdAt: new Date()
      };
      const result = await db.collection('users').insertOne(userDoc);
      user = { _id: result.insertedId, ...userDoc };
    }

    const token = createToken(user);

    // For demo: respond with token in simple page so user can copy it
    res.send(`<html><body>
      <h2>Login successful</h2>
      <p>Copy this token and paste it into Swagger Authorize (or use Bearer header):</p>
      <textarea style="width:100%;height:100px;">${token}</textarea>
      <p><a href="/">Return</a></p>
    </body></html>`);
  } catch (err) {
    console.error('githubCallback error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, githubCallback };
