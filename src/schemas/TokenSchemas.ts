import {Request} from 'express'

type tokenPayload = {
    id: string,
    username: string,
    email: string
}

export interface CustomRequest extends Request {
    user?: tokenPayload;
}