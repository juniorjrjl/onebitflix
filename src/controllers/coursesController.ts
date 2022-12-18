import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getPaginationParams } from "../helpers/getPaginationParams"
import { getIdNumber } from "../helpers/paramConverter"
import { coursesQueryService } from "../services/coursesQueryService"

export const coursesController = {
    featured: async (req: Request, res: Response) =>{
        try {
            const featuredCourse = await coursesQueryService.getRandomFeaturedCourses()
            return res.json(featuredCourse)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    },
    
    newest: async (req: Request, res: Response) =>{
        try {
            const newest = await coursesQueryService.getTopTenNewest()
            return res.json(newest)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    },

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
    },

    search: async (req: Request, res: Response) =>{
        let { name } = req.query
        const [page, perPage ] = getPaginationParams(req.query)
        try {
            if (typeof name !== 'string') name = undefined
            const courses = await coursesQueryService.findByName(page, perPage, name)
            return res.json(courses)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}