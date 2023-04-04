import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from "../middlewares/auth";
import { favoritesQueryService } from '../services/queries/favoritesQueryService';
import { favoritesService } from '../services/favoritesService'
import { getIdNumber } from '../helpers/paramConverter';
import { checkValidators } from '../validatos/validatorUtils';
import { indexSerializer, saveSerializer } from '../serializers/favoritesSerializer';

export const favoritesController = {

    save: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {    
            checkValidators(req)
            const userId = req.user!.id
            const { courseId } = req.body
            const favorite = await favoritesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(saveSerializer(favorite))
        } catch (err) {
            next(err)
        }
    },
    
    index: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.user!.id
            const favorites = await favoritesQueryService.findByUserId(userId)
            return res.json(indexSerializer(favorites))
        } catch (err) {
            next(err)
        }
    },

    delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const userId = req.user!.id
            const courseId = getIdNumber(req.params)
            await favoritesService.delete(userId, courseId)
            return res.status(StatusCodes.NO_CONTENT).send()
        } catch (err) {
            next(err)
        }
    }
}