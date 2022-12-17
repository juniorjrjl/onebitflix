import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getIdNumber } from "../helpers/paramConverter"
import { coursesQueryService } from "../services/coursesQueryService"

export const coursesController = {
    show: async (req: Request, res: Response) =>{
        const id = getIdNumber(req.params)
        try {
            const course = await coursesQueryService.findByIdWithEpisodes(id)
            return res.json(course)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}