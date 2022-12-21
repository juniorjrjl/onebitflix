import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AuthenticatedRequest } from '../middlewares/auth'
import { likesService } from '../services/likesService'

export const likesController = {
    save: async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id
        const { courseId } = req.body

        try {
            const like = await likesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(like)
        } catch (err) {
            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }
        }
    }
}