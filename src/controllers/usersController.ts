import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from '../middlewares/auth'
import { usersQueryService } from "../services/queries/usersQueryService";

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
    }

}