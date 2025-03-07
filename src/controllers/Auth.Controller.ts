import { Request, Response } from "express";
import { registerSchema, signInSchema } from "../schemas/AuthSchemas";
import { CustomRequest } from '../schemas/TokenSchemas'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_AUTH_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY, NODE_ENV } from '../config/variables'

const registerUser = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body)
    if (result.error || !result.success) {
        const formattedErrors = Object.entries(result.error.formErrors.fieldErrors).map(([field, errors]) => ({
            field,
            message: errors?.join(", ") || "Valor invalido"
        }));
        res.status(422).json({ errors: formattedErrors });
        return;
    }

    try {
        const existingEmail = await User.getUserByEmail(result.data.email)
        if (existingEmail) {
            res.status(400).json({ message: 'El email ya se encuentra registrado' })
            return
        }
        const existingUsername = await User.getUserByUsername(result.data.username)
        if (existingUsername) {
            res.status(400).json({ message: 'El nombre de usuario esta en uso' })
            return
        }

        const hashedPassword = await bcrypt.hash(result.data.password, 12)
        const data = await User.createNewUser(result.data.email, result.data.username, hashedPassword)

        res.status(201).json({ message: 'Usuario registrado correctamente', datos: data })
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: (error as { message?: string })?.message });
    }
}

const loginUser = async (req: Request, res: Response) => {
    const result = signInSchema.safeParse(req.body)
    if (result.error || !result.success) {
        const formattedErrors = Object.entries(result.error.formErrors.fieldErrors).map(([field, errors]) => ({
            field,
            message: errors?.join(", ") || "Valor invalido"
        }));
        res.status(422).json({ errors: formattedErrors });
        return;
    }

    try {
        const user = await User.getUserByEmail(result.data.email)
        if(!user) {
            res.status(404).json({ message: 'No se encontro el usuario' })
            return
        }

        const validPassword = await bcrypt.compare(result.data.password, user.password)
        if(!validPassword) {
            res.status(400).json({ message: 'La contraseña no es correcta' })
            return
        }

        const tokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const token = jwt.sign(tokenPayload, JWT_AUTH_TOKEN_KEY, { expiresIn: '15m' })
        const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_TOKEN_KEY, { expiresIn: '3d' })

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 15
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 3
        });

        res.status(201).json({ message: 'Verificacion correcta' })
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: (error as { message?: string })?.message})
    }
}

const UserAuth = async (req: CustomRequest, res: Response) => {
    const user = req.user;
    try {
        const existingUser = await User.getUserByEmail((user as { email: string})?.email)
        if(!existingUser) {
            res.status(404).json({ message: 'No se encontro el usuario' })
            return
        }

        const UserData = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email
        }

        res.status(200).json({ user: UserData })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario' })
    }
}

const logOut = (_: CustomRequest, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ message: 'Sesion cerrada correctamente' })
}

export default {
    registerUser,
    loginUser,
    UserAuth,
    logOut
}