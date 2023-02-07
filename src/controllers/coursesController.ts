import { NextFunction, Request, Response } from "express"
import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { getPaginationParams } from "../helpers/getPaginationParams"
import { getIdNumber } from "../helpers/paramConverter"
import { AuthenticatedRequest } from "../middlewares/auth"
import { coursesQueryService } from "../services/queries/coursesQueryService"
import { favoritesQueryService } from "../services/queries/favoritesQueryService"
import { likesQueryService } from "../services/queries/LikesQueryService"

export const coursesController = {
    featured: async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const featuredCourse = await coursesQueryService.getRandomFeaturedCourses()
            return res.json(featuredCourse)
        } catch (err) {
            next(err)
        }
    },
    
    newest: async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const newest = await coursesQueryService.getTopTenNewest()
            return res.json(newest)
        } catch (err) {
            next(err)
        }
    },

    show: async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
        const courseId = getIdNumber(req.params)
        const userId = req.user!.id
        try {
            const course = await coursesQueryService.findByIdWithEpisodes(courseId)
            if (!course) throw new ModelNotFoundError('Curso não encontrado')

            const liked = await likesQueryService.isLiked(userId, courseId)
            const favorited = await favoritesQueryService.isFavorited(userId, courseId)
            return res.json({...course.get(), liked, favorited})  
        } catch (err) {
            next(err)
        }
    },

    search: async (req: Request, res: Response, next: NextFunction) =>{
        let { name } = req.query
        const [page, perPage ] = getPaginationParams(req.query)
        try {
            if (typeof name !== 'string') name = undefined
            const courses = await coursesQueryService.findByName(page, perPage, name)
            return res.json(courses)
        } catch (err) {
            next(err)
        }
    },

    popular: async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const topTen = await coursesQueryService.getTopTenByLikes()
            res.json(topTen)
        } catch (err) {
            next(err)
        }
    }
}