const express = require('express')
const router = express.Router()

// const auth = require('../middlewares/auth')

const bookControl = require('../controllers/book')

router.get('/', bookControl.getAllBooks)

router.get('/:id', auth, bookControl.findOneBook)

router.post('/', auth, bookControl.createBook)

router.put('/:id', auth, bookControl.modifyBook)

router.delete('/:id', auth, bookControl.deleteBook)

module.exports = router
