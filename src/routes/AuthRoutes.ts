import express from 'express'
import AuthController from '../controllers/Auth.Controller'
import { VerifyToken } from '../middlewares/Auth.middleware'

const router = express.Router()

router.get('/', VerifyToken, AuthController.UserAuth)

router.post('/sign-up', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.post('/logout', AuthController.logOut)

export default router