import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../services/jwtService";
import { usersService } from "../services/userService";
import { usersQueryService } from "../services/queries/usersQueryService";
import { EmailInUseError } from "../errors/emailInUseError";
import { ModelNotFoundError } from "../errors/modelNotFoundError";
import { PayloadDTO } from "../dto/payloadDTO";
import { checkValidators } from "../validatos/validatorUtils";
import { loginSerializer, registerSerializer } from "../serializers/authSerializer";

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
            return res.status(StatusCodes.CREATED).json(registerSerializer(user))
        }catch(err){
            next(err)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const { email, password } = req.body
            const user = await usersQueryService.findByEmail(email)
            await usersQueryService.checkPassword(password, user)
            const payload = new PayloadDTO(user.id, user.firstName, user.email)
            const token = jwtService.sign(payload, '1d')
            return res.json(loginSerializer(token))
        }catch(err){
            next(err)
        }
    }
}
