import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from '../middlewares/auth'
import { usersQueryService } from "../services/queries/usersQueryService";
import { usersService } from "../services/userService";

export const usersController = {

    watching: async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.user!
        try{
            const watching = await usersQueryService.getKeepWatchingList(id)
            return res.json(watching)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },

    show: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const currentUser = req.user!
            return res.json(currentUser)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },

    update: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const { id } = req.user!
            const { firstName, lastName, phone, birth, email } = req.body
            const updatedUser = await usersService.update(id, {firstName, lastName, phone, birth, email})
            return res.json(updatedUser)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },

    changePassword: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const user = req.user!
            const { currentPassword, passwordConfirm, newPassword} = req.body
            if (currentPassword !== passwordConfirm) throw new Error('Os campos "currentPassword" e "passwordConfirm" são diferentes')
            user.checkPassword(currentPassword,async (err, isSame) => {
                if(err) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
                if(!isSame) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Senha incorreta' })
                
                await usersService.updatePassword(user!.id, newPassword)
                return res.status(StatusCodes.NO_CONTENT).send()
            })
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    }

}