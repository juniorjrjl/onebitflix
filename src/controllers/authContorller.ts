import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../services/jwtService";
import { usersService } from "../services/userService";
import { usersQueryService } from "../services/usersQueryService";

export const authController = {
    register: async (req: Request, res: Response) => {
        const { firstName, lastName, email, password, phone, birth } = req.body
        try{
            const userAlreadyExists = await usersQueryService.findByemail(email)
            if (userAlreadyExists){
                throw new Error('Este e-mail já está cadastrado')
            }
            const user = await usersService.create({ firstName, lastName, email, password, phone, birth, role: 'user' })
            return res.status(StatusCodes.CREATED).json(user)
        }catch(err){
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body
        try{
            const user = await usersQueryService.findByemail(email)
            if (!user) return res.status(StatusCodes.NOT_FOUND).json({message: 'email não registradd'})
            user.checkPassword(password, (err, isSame) => {
                if (err) return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
                if (!isSame) return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Senha incorreta'})
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
            })
        }catch(err){
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}