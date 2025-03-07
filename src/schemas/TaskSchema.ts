import { z } from 'zod'

export const taskSchema = z.object({
    title: z.string({ required_error: 'El titulo es requerido' }).nonempty('El titulo es requerido'),
    description: z.string({ required_error: 'La descripcion no puede ser undefined' }),
    status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
    assigned_to: z.string({ required_error: 'Debe asignarle la tarea a alguien'}).nonempty('Debe asignarle la tarea a alguien')
})