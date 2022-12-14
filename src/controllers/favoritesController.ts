import { Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from "../middlewares/auth";
import { favoritesQueryService } from '../services/queries/favoritesQueryService';
import { favoritesService } from '../services/favoritesService'
import { getIdNumber } from '../helpers/paramConverter';

export const favoritesController = {

    save: async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id
        const { courseId } = req.body

        try {
            const favorite = await favoritesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(favorite)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },
    
    index: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const userId = req.user!.id
            const favorites = await favoritesQueryService.findByUserId(userId)
            return res.json(favorites)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },

    delete: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const userId = req.user!.id
            const courseId = getIdNumber(req.params)
            await favoritesService.delete(userId, courseId)
            return res.status(StatusCodes.NO_CONTENT).send()
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    }
}