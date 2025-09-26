const router = require('express').Router();

router.get('/', (req, res) => { res.send('Library API'); });

// swagger UI route (serves generated swagger.json)
router.use('/', require('./swagger'));

// mount resource routers
router.use('/books', require('./books'));
router.use('/authors', require('./authors'));

module.exports = router;
