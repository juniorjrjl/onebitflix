import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { getIdNumber } from "../helpers/paramConverter";
import { categoriesQueryService } from "../services/queries/categoriesQueryService";

export const categoriesController = {
    index: async (req: Request, res: Response) => {
        const [page, perPage ] = getPaginationParams(req.query)
        try{
            const paginated = await categoriesQueryService.findAllPaginated(page, perPage)
            return res.json(paginated)
        }catch(err){
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    },

    show: async (req: Request, res: Response) => {
        const id = getIdNumber(req.params)
        try {
            const category = await categoriesQueryService.findByIdWithCourses(id)
            return res.json(category)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }

}