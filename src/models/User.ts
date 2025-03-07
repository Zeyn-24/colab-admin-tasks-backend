import pool from '../config/supabaseClient'

// Funcion para crear nuevo usuario
const createNewUser = async (email: string, username: string, password: string) => {
    try {
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, username, email`,
            [username, email, password]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error)
        throw new Error('Error al registrar el usuario')
    }
}

// Función para obtener un usuario por email
const getUserByEmail = async (email: string) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];  // Devuelve el primer usuario encontrado
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el usuario');
    }
}

// Función para obtener un usuario por username
const getUserByUsername = async (username: string) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];  // Devuelve el primer usuario encontrado
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el usuario');
    }
}

const getUsers = async () => {
    try {
        const result = await pool.query(
            'SELECT * FROM users'
        );
        return result.rows;  // Devuelve el primer usuario encontrado
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener los usuarios');
    }
}

export default {
    createNewUser,
    getUserByEmail,
    getUserByUsername,
    getUsers
}