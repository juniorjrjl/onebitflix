import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AuthenticatedRequest } from '../middlewares/auth'
import { likesService } from '../services/likesService'

export const likesController = {
    save: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user!.id
            const { courseId } = req.body
            const like = await likesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(like)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    },

    delete: async (req: AuthenticatedRequest, res: Response) => {
        try{
            const userId = req.user!.id
            const { courseId } = req.body
            likesService.delete(userId, courseId)
            return res.status(StatusCodes.NO_CONTENT)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    }
}