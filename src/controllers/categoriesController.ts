import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { getIdNumber } from "../helpers/paramConverter";
import { categoriesQueryService } from "../services/queries/categoriesQueryService";
import { checkValidators } from "../validatos/validatorUtils";
import { indexSerializer, showSerializer } from "../serializers/categoriesSerializer";

export const categoriesController = {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const [page, perPage] = getPaginationParams(req.query)
            const paginated = await categoriesQueryService.findAllPaginated(page, perPage)
            return res.json(indexSerializer(paginated))
        }catch(err){
            next(err)
        }
    },

    show: async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkValidators(req)
            const id = getIdNumber(req.params)
            const category = await categoriesQueryService.findByIdWithCourses(id)
            return res.json(showSerializer(category!))
        } catch (err) {
            next(err)
        }
    }

}