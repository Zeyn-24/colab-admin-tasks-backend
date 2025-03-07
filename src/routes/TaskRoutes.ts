import express from 'express'
import TaskController from '../controllers/Task.Controller'
import { VerifyToken } from '../middlewares/Auth.middleware'

const router = express.Router()

router.get('/', VerifyToken, TaskController.getTasks)

router.post('/', VerifyToken, TaskController.createNewTask)

export default router