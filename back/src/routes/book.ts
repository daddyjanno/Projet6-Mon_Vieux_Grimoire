import express from 'express'
import auth from '../middlewares/auth'

import multer from '../middlewares/multer-config'
import sharpOptimization from '../middlewares/sharp'
import bookControl from '../controllers/book'

const router = express.Router()

router.get('/bestrating', bookControl.getBestRating)
router.get('/', bookControl.getAllBooks)
router.get('/:id', bookControl.findOneBook)

router.post('/', auth, multer, sharpOptimization, bookControl.createBook)
router.post('/:id/rating', auth, bookControl.createRating)

router.put('/:id', auth, multer, sharpOptimization, bookControl.modifyBook)

router.delete('/:id', auth, bookControl.deleteBook)

export default router
