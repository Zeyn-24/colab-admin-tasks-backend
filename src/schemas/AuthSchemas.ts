import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string({required_error: 'El email es requerido'}).nonempty('El email es requerido').email('El email no tiene un formato valido'),
    username: z.string({required_error: 'El nombre de usuario es requerido'}).nonempty('El nombre de usuario es requerido').min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string({required_error: 'La contraseña es requerida'}).nonempty('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres').max(20, 'La contraseña debe tener al menos 20 caracteres'),
})

export const signInSchema = z.object({
    email: z.string({required_error: 'El email es requerido'}).nonempty('El email es requerido').email('El email no tiene un formato valido'),
    password: z.string({ required_error: 'La contraseña es requerida'}).nonempty('La contraseña es requerida')
})