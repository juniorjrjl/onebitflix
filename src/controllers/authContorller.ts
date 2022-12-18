import e, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
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
    }
}