const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');             // single passport require
require('./auth/passport-setup');                 // register GitHub strategy (no reassignment)

const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// parse JSON bodies
app.use(bodyParser.json());

// initialize passport (required for OAuth endpoints)
app.use(passport.initialize());

// CORS & common headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // include Authorization header so Swagger / clients can send Bearer tokens
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // quick respond to OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Mount auth routes (register, login, GitHub OAuth)
app.use('/auth', require('./routes/auth'));

// Mount main application routes (these include /api-docs via your routes/swagger.js)
app.use('/', require('./routes'));

// Initialize DB and start the server
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1); // fail fast if DB can't initialize
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});
