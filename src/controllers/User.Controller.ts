import { Response } from "express";
import { CustomRequest } from "../schemas/TokenSchemas";
import User from '../models/User'

const getUsers = async (req: CustomRequest, res: Response) => {
    const id = req.user?.id
    try {
        const users = await User.getUsers()
        const usersFiltereds = users.filter((user) => user.id !== id)

        res.status(200).json(usersFiltereds)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios'})
    }
}

export default {
    getUsers
}