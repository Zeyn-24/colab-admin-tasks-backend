import pool from '../config/supabaseClient'

// Función para obtener una tarea por su id
const getTask = async (id: number) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );
        return result.rows[0];  // Devuelve el primer usuario encontrado
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el usuario');
    }
}

// Funcion para obtener las tareas de un usuario
const getTasksByUserID = async (id: string) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE owner_id = $1',
            [id]
        );
        return result.rows;  // Devuelve el primer usuario encontrado
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el usuario');
    }
}

const createTask = async (title: string, description: string, assigned_to: string, id: string) => {
    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, description, owner_id, assigned_to)
                VALUES ($1, $2, $3, $4)
                RETURNING id, title, description`,
            [title, description, id, assigned_to]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error)
        throw new Error('Error al crear la tarea')
    }
}

export default {
    getTask,
    getTasksByUserID,
    createTask
}