import { Router } from "express";
import { VerifyToken } from "../middlewares/Auth.middleware";
import UserController from "../controllers/User.Controller";

const router = Router()

router.get('/', VerifyToken, UserController.getUsers)

export default router