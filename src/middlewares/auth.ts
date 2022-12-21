import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserInstance } from "../models/User";
import { jwtService } from "../services/jwtService";
import { usersQueryService } from "../services/usersQueryService";

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
        
        const user = await usersQueryService.findByemail((decoded as JwtPayload).email)
        req.user = user
        next()
    })
}