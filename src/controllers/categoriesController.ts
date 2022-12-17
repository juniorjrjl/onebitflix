import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { categoriesQueryServices } from "../services/categoriesQueryServices";

export const categoriesController = {
    index: async (req: Request, res: Response) => {
        const [page, perPage ] = getPaginationParams(req.query)
        
        try{
            const paginated = await categoriesQueryServices.findAllPaginated(page, perPage)
            return res.json(paginated)
        }catch(err){
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}