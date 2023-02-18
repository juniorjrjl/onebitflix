import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { getIdNumber } from "../helpers/paramConverter";
import { categoriesQueryService } from "../services/queries/categoriesQueryService";
import { checkValidators } from "../validatos/validatorUtils";

export const categoriesController = {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const [page, perPage] = getPaginationParams(req.query)
            const paginated = await categoriesQueryService.findAllPaginated(page, perPage)
            return res.json(paginated)
        }catch(err){
            next(err)
        }
    },

    show: async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkValidators(req)
            const id = getIdNumber(req.params)
            const category = await categoriesQueryService.findByIdWithCourses(id)
            return res.json(category)
        } catch (err) {
            next(err)
        }
    }

}