import { SUPABASE_URL } from './variables'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Verifica la conexión
pool.connect()
    .then(() => console.log('Conexión a la base de datos PostgreSQL exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos: ', err.stack));

export default pool