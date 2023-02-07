import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from '../middlewares/auth'
import { usersQueryService } from "../services/queries/usersQueryService";
import { usersService } from "../services/userService";

export const usersController = {

    watching: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { id } = req.user!
        try{
            const watching = await usersQueryService.getKeepWatchingList(id)
            return res.json(watching)
        } catch (err) {
            next(err)
        }
    },

    show: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            const currentUser = req.user!
            return res.json(currentUser)
        } catch (err) {
            next(err)
        }
    },

    update: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            const { id } = req.user!
            const { firstName, lastName, phone, birth, email } = req.body
            const updatedUser = await usersService.update(id, {firstName, lastName, phone, birth, email})
            return res.json(updatedUser)
        } catch (err) {
            next(err)
        }
    },

    changePassword: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            const user = req.user!
            const { currentPassword, passwordConfirm, newPassword } = req.body
            if (newPassword !== passwordConfirm) throw new Error('Os campos "newPassword" e "passwordConfirm" são diferentes')
            
            await usersQueryService.checkPassword(currentPassword, user)
            await usersService.updatePassword(user!.id, newPassword)
            return res.status(StatusCodes.NO_CONTENT).send()

        } catch (err) {
            next(err)
        }
    }

}