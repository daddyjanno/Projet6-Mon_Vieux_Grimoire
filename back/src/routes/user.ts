import express from 'express'
const router = express.Router()

import userControl from '../controllers/user'

router.post('/signup', userControl.signup)
router.post('/login', userControl.login)

export default router
