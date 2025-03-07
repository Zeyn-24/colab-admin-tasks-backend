import { Response } from "express"
import { CustomRequest } from "../schemas/TokenSchemas"
import Task from '../models/Task'
import { taskSchema } from "../schemas/TaskSchema"

const getTasks = async (req: CustomRequest, res: Response) => {
    const id = req.user?.id
    try {
        const tasks = await Task.getTasksByUserID(id as string)
        
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas', error: (error as {message: string}).message })
    }
}

const createNewTask = async (req: CustomRequest, res: Response) => {
    const id = req.user?.id

    const result = taskSchema.safeParse(req.body)
    if (result.error || !result.success) {
        const formattedErrors = Object.entries(result.error.formErrors.fieldErrors).map(([field, errors]) => ({
            field,
            message: errors?.join(", ") || "Valor invalido"
        }));
        res.status(422).json({ errors: formattedErrors });
        return;
    }
    const data = result.data
    try {
        const task = await Task.createTask(data.title, data.description, data.assigned_to, id as string)
        if (!task) {
            res.status(400).json({ message: 'Error al crear la tarea' })
            return
        }

        res.status(201).json({ message: 'Tarea creada correctamente', task})
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error: (error as { message: string}).message })
    }
}

export default {
    getTasks,
    createNewTask
}