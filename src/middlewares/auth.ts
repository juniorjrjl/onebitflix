import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserInstance } from "../models/User";
import { jwtService } from "../services/jwtService";
import { usersQueryService } from "../services/queries/usersQueryService";

export interface AuthenticatedRequest extends Request {
    user?: UserInstance | null
}

export const ensure = (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado: nenhum token foi encontrado'})
    if (!authorizationHeader.startsWith('Bearer ')) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'O parâmetro "authorization", no header, deve iniciar com "Bearer "'})

    const token = authorizationHeader.replace(/Bearer /, '')
    jwtService.verify(token, async (err, decoded) => {
        if (err || typeof decoded === 'undefined') return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Não autorizado: token inválido'})
        
        const user = await usersQueryService.findByEmail((decoded as JwtPayload).email)
        req.user = user
        next()
    })
}


export function ensureQuery(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { token } = req.query

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado: nenhum token encontrado' })
    }

    if (typeof token !== 'string') {
        return res.status(400).json({ message: 'O parâmetro token deve ser do tipo string' })
    }

    jwtService.verify(token, (err, decoded) => {
        if (err || typeof decoded === 'undefined') {
            return res.status(401).json({ message: 'Não autorizado: token inválido' })
        }
        usersQueryService.findByEmail((decoded as JwtPayload).email).then(user => {
            req.user = user
            next()
        })
    })
}