import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../models/User";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { InvalidParamError } from "../errors/invalidParamError";
import container from "../container";

export interface AuthenticatedRequest extends Request {
    user?: UserInstance | null
}

export const ensure = (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
    try{
        const jwtService = container.cradle.jwtService
        const usersQueryService = container.cradle.usersQueryService
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new UnauthorizedError('Não autorizado: nenhum token foi encontrado')
        if (!authorizationHeader.startsWith('Bearer ')) throw new UnauthorizedError('O parâmetro "authorization", no header, deve iniciar com "Bearer "')

        const token = authorizationHeader.replace(/Bearer /, '')
        jwtService.verify(token, async (err, decoded) => {
            try{
                if (err || typeof decoded === 'undefined') throw new UnauthorizedError('Não autorizado: token inválido')
                
                const user = await usersQueryService.findByEmail((decoded as JwtPayload).email)
                req.user = user
                next()
            }catch(err){
                next(err)
            }
        })
    }catch(err){
        next(err)
    }
}


export function ensureQuery(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try{
        const jwtService = container.cradle.jwtService
        const usersQueryService = container.cradle.usersQueryService
        const { token } = req.query

        if (!token) throw new UnauthorizedError('Não autorizado: nenhum token encontrado')

        if (typeof token !== 'string') throw new InvalidParamError('O parâmetro token deve ser do tipo string')

        jwtService.verify(token, (err, decoded) => {
            try{
                if (err || typeof decoded === 'undefined') throw new UnauthorizedError('Não autorizado: token inválido')
                usersQueryService.findByEmail((decoded as JwtPayload).email).then(user => {
                    req.user = user
                    next()
                })
            }catch(err){
                next(err)
            }
        })
    }catch(err){
        next(err)
    }
}