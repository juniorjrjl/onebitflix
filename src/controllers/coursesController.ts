import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { getPaginationParams } from "../helpers/getPaginationParams"
import { getIdNumber } from "../helpers/paramConverter"
import { AuthenticatedRequest } from "../middlewares/auth"
import { coursesQueryService } from "../services/queries/coursesQueryService"
import { favoritesQueryService } from "../services/queries/favoritesQueryService"
import { likesQueryService } from "../services/queries/LikesQueryService"

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

    show: async (req: AuthenticatedRequest, res: Response) =>{
        const courseId = getIdNumber(req.params)
        const userId = req.user!.id
        try {
            const course = await coursesQueryService.findByIdWithEpisodes(courseId)
            if (!course) return res.status(StatusCodes.NOT_FOUND).json({message: 'Curso não encontrado'})

            const liked = await likesQueryService.isLiked(userId, courseId)
            const favorited = await favoritesQueryService.isFavorited(userId, courseId)
            return res.json({...course.get(), liked, favorited})  
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
    },

    popular: async (req: Request, res: Response) =>{
        try {
            const topTen = await coursesQueryService.getTopTenByLikes()
            res.json(topTen)
        } catch (err) {
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}