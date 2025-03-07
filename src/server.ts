import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT, FRONTEND_API_URL } from './config/variables'
import AuthRoutes from './routes/AuthRoutes'
import TaskRoutes from './routes/TaskRoutes'
import UserRoutes from './routes/UserRoutes'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: FRONTEND_API_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Backend!')
})

app.use('/api/auth', AuthRoutes)

app.use('/api/tasks', TaskRoutes)

app.use('/api/users', UserRoutes)

app.listen(PORT, () => {
    console.log(`Server Running in Port: ${PORT}`)
})