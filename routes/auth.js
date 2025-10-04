const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/auth');

// Local routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ], session: false }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/github/fail', session: false }), authController.githubCallback);
router.get('/github/fail', (req, res) => res.status(401).json({ message: 'GitHub auth failed' }));

module.exports = router;
