const express = require('express')
const router = express.Router()

const bookControl = require('../controllers/book')

const Book = require('../models/Book')

router.get('/', bookControl.getAllBooks())

router.get('/:id', bookControl.findOneBook())

router.post('/', bookControl.createBook())

router.put('/:id', bookControl.modifyBook())

router.delete('/:id', bookControl.deleteBook())

module.exports = router
