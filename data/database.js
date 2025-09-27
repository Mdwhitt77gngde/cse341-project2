// data/database.js
const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database; // will hold the MongoClient

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  // Connect using the connection string from .env
  MongoClient.connect(process.env.MONGODB_URL)
    .then(async (client) => {
      // Keep the MongoClient so existing controllers that do getDatabase().db() continue to work
      database = client;

      // --- Diagnostics (safe: does not print password) ---
      try {
        const db = client.db(); // uses DB in URI (or default)
        console.log('DEBUG: MONGODB_URL present?', !!process.env.MONGODB_URL);
        console.log('DEBUG: connected to mongodb. db name =', db.databaseName);

        // List collections and counts
        const cols = await db.listCollections().toArray();
        console.log('DEBUG: collections in DB:', cols.map(c => c.name));

        // Print counts for typical collections if they exist
        const check = ['authors', 'books', 'users'];
        for (const name of check) {
          const exists = cols.some(c => c.name === name);
          if (exists) {
            const cnt = await db.collection(name).countDocuments();
            console.log(`DEBUG: collection "${name}" exists; count = ${cnt}`);
          } else {
            console.log(`DEBUG: collection "${name}" does NOT exist in this DB`);
          }
        }
      } catch (err) {
        console.error('DEBUG: db inspection error:', err && err.message ? err.message : err);
      }
      // --- end diagnostics ---

      return callback(null, database);
    })
    .catch((err) => {
      console.error('DEBUG: MongoDB connect error:', err && err.message ? err.message : err);
      return callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database not initalized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};
