import { config } from 'dotenv'
config()

export const {
    SUPABASE_URL = '',
    FRONTEND_API_URL = '',
    PORT = '',
    JWT_AUTH_TOKEN_KEY = '',
    JWT_REFRESH_TOKEN_KEY = '',
    NODE_ENV = '',
} = process.env