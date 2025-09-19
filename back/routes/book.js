const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

const bookControl = require('../controllers/book')

router.get('/', bookControl.getAllBooks)

router.get('/:id', bookControl.findOneBook)

router.post('/', auth, multer, bookControl.createBook)

router.put('/:id', auth, multer, bookControl.modifyBook)

router.delete('/:id', auth, bookControl.deleteBook)

module.exports = router
