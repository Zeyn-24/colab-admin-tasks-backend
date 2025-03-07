import { Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JWT_REFRESH_TOKEN_KEY, JWT_AUTH_TOKEN_KEY, NODE_ENV } from '../config/variables';
import { CustomRequest } from '../schemas/TokenSchemas'

export const VerifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies['access_token'];
        if (!accessToken) {
            const refreshToken = req.cookies['refresh_token'];
            if (!refreshToken) {
                res.status(401).json({ message: 'usuario no autenticado' });
                return
            }
            jwt.verify(refreshToken, JWT_REFRESH_TOKEN_KEY, (error: VerifyErrors | null, RefreshUser: any) => {
                if (error) {
                    res.status(401).json({ message: 'Usuario no autenticado' });
                    return
                }
                const tokenPayload = {
                    email: RefreshUser.email,
                    id: RefreshUser.id,
                    username: RefreshUser.username,
                }
                const accessToken = jwt.sign(tokenPayload, JWT_AUTH_TOKEN_KEY, { expiresIn: '15m' });
                const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_TOKEN_KEY, { expiresIn: '3d' });
                res.cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: NODE_ENV === 'production',
                    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 15 * 60 * 1000
                });
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: NODE_ENV === 'production',
                    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 3 * 24 * 60 * 60 * 1000
                });
                req.user = RefreshUser;
                next();
            });
        } else {
            jwt.verify(accessToken, JWT_AUTH_TOKEN_KEY, (error: VerifyErrors | null, decoded: any) => {
                if (error) {
                    const refreshToken = req.cookies['refresh_token'];
                    if (!refreshToken) {
                        res.status(401).json({ message: 'Usuario no autenticado' });
                        return
                    }
                    jwt.verify(refreshToken, JWT_REFRESH_TOKEN_KEY, (error: VerifyErrors | null, RefreshUser: any) => {
                        if (error) {
                            res.status(401).json({ message: 'Usuario no autenticado' });
                            return
                        }
                        const tokenPayload = {
                            email: RefreshUser.email,
                            id: RefreshUser.id,
                            username: RefreshUser.username,
                        }
                        const accessToken = jwt.sign(tokenPayload, JWT_AUTH_TOKEN_KEY, { expiresIn: '15m' });
                        const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_TOKEN_KEY, { expiresIn: '3d' });
                        res.cookie('access_token', accessToken, {
                            httpOnly: true,
                            secure: NODE_ENV === 'production',
                            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                            maxAge: 15 * 60 * 1000
                        });
                        res.cookie('refresh_token', refreshToken, {
                            httpOnly: true,
                            secure: NODE_ENV === 'production',
                            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                            maxAge: 3 * 24 * 60 * 60 * 1000
                        });
                        req.user = RefreshUser;
                        next();
                    });
                }
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        res.status(401).json({ message: 'Error al verificar la sesion del usuario' });
    }
}