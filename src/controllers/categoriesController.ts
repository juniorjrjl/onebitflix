import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { getIdNumber } from "../helpers/paramConverter";
import { categoriesQueryService } from "../services/queries/categoriesQueryService";

export const categoriesController = {
    index: async (req: Request, res: Response, next: NextFunction) => {
        const [page, perPage ] = getPaginationParams(req.query)
        try{
            const paginated = await categoriesQueryService.findAllPaginated(page, perPage)
            return res.json(paginated)
        }catch(err){
            next(err)
        }
    },

    show: async (req: Request, res: Response, next: NextFunction) => {
        const id = getIdNumber(req.params)
        try {
            const category = await categoriesQueryService.findByIdWithCourses(id)
            return res.json(category)
        } catch (err) {
            next(err)
        }
    }

}