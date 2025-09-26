const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const sharp = require('../middlewares/sharp')

const bookControl = require('../controllers/book')

router.get('/bestrating', bookControl.getBestRating)
router.get('/', bookControl.getAllBooks)
router.get('/:id', bookControl.findOneBook)

router.post('/', auth, multer, sharp, bookControl.createBook)
router.post('/:id/rating', auth, bookControl.createRating)

router.put('/:id', auth, multer, bookControl.modifyBook)

router.delete('/:id', auth, bookControl.deleteBook)

module.exports = router
