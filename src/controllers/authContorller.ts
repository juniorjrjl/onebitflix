import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../services/jwtService";
import { usersService } from "../services/userService";
import { usersQueryService } from "../services/queries/usersQueryService";
import { EmailInUseError } from "../errors/emailInUseError";
import { ModelNotFoundError } from "../errors/modelNotFoundError";
import { PayloadDTO } from "../dto/payloadDTO";
import { LoginResponse } from "../responses/loginResponse";
import { checkValidators } from "../validatos/validatorUtils";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const { firstName, lastName, email, password, phone, birth } = req.body
            try{
                await usersQueryService.findByEmail(email)
                throw new EmailInUseError('Este e-mail já está cadastrado')
            }catch(err){
                if (!(err instanceof ModelNotFoundError)) throw err
            }
            const user = await usersService.create({ firstName, lastName, email, password, phone, birth, role: 'user' })
            return res.status(StatusCodes.CREATED).json(user)
        }catch(err){
            next(err)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try{
            console.log('chegou')
            checkValidators(req)
            const { email, password } = req.body
            const user = await usersQueryService.findByEmail(email)
            await usersQueryService.checkPassword(password, user)
            const payload = new PayloadDTO(user.id, user.firstName, user.email)
            const token = jwtService.sign(payload, '1d')
            let currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + 1)
            const expiresIn = currentDate.getTime()
            
            return res.json(new LoginResponse(token, expiresIn))
        }catch(err){
            next(err)
        }
    }
}
