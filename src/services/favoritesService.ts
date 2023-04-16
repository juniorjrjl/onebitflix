import { Favorite } from "../models"
import CoursesQueryService from "./queries/coursesQueryService"
import UsersQueryService from "./queries/usersQueryService"
import FavoritesQueryService from './queries/favoritesQueryService'
import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { CourseAlreadyFavoritedError } from "../errors/courseAlreadyFavoritedError"

export default class FavoritesService{

    constructor(private readonly usersQueryService: UsersQueryService,
                private readonly coursesQueryService: CoursesQueryService,
                private readonly favoritesQueryService: FavoritesQueryService){}

	async create(userId: number, courseId: number){
        await this.usersQueryService.findById(userId)
        await this.coursesQueryService.findById(courseId)
        const isFavorite = await this.favoritesQueryService.isFavorited(userId, courseId)
        if (isFavorite) throw new CourseAlreadyFavoritedError(`O usuário ${userId} já tem o curso ${courseId} na lista de favoritos`)

        const favorite = await Favorite.create({ userId, courseId})
        return favorite
    }

    async delete(userId: number, courseId: number){
        await this.usersQueryService.findById(userId)
        await this.coursesQueryService.findById(courseId)
        const isFavorite = await this.favoritesQueryService.isFavorited(userId, courseId)
        if (!isFavorite) throw new ModelNotFoundError(`O usuário ${userId} não tem o curso ${courseId} na sua lista de favoritos`)

        await Favorite.destroy({
            where:{
                userId,
                courseId
            }
        })
    }
}