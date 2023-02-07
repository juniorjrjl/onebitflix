import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../services/jwtService";
import { usersService } from "../services/userService";
import { usersQueryService } from "../services/queries/usersQueryService";
import { EmailInUseError } from "../errors/emailInUseError";
import { OneBitFlixError } from "../errors/oneBitFlixError";
import { UnauthorizedError } from "../errors/unauthorizedError";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password, phone, birth } = req.body
        try{
            const userAlreadyExists = await usersQueryService.findByEmail(email)
            if (userAlreadyExists){
                throw new EmailInUseError('Este e-mail já está cadastrado')
            }
            const user = await usersService.create({ firstName, lastName, email, password, phone, birth, role: 'user' })
            return res.status(StatusCodes.CREATED).json(user)
        }catch(err){
            next(err)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        try{
            const user = await usersQueryService.findByEmail(email)
            if (!user) return res.status(StatusCodes.NOT_FOUND).json({message: 'email não registradd'})
            const isSame = await usersQueryService.checkPassword(password, user)
            if (!isSame) throw new UnauthorizedError('Senha incorreta')
            const payload = { 
                id: user.id,
                firstName: user.firstName,
                email: user.email
            }
            const token = jwtService.sign(payload, '1d')
            let currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + 1)
            const expiresIn = currentDate.getTime()
            return res.json({ 'type' : 'Bearer', token, expiresIn })
        }catch(err){
            next(err)
        }
    }
}
