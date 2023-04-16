import { CourseAlreadyLikedError } from "../errors/courseAlreadyLikedError"
import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { Like } from "../models/"
import CoursesQueryService from "./queries/coursesQueryService"
import LikesQueryService from "./queries/likesQueryService"
import UsersQueryService from "./queries/usersQueryService"

export default class LikesService{

    constructor(private readonly usersQueryService: UsersQueryService,
                private readonly coursesQueryService: CoursesQueryService,
                private readonly likesQueryService: LikesQueryService){}

    async create(userId: number, courseId: number){
        await this.usersQueryService.findById(userId)
        await this.coursesQueryService.findById(courseId)
        const isFavorite = await this.likesQueryService.isLiked(userId, courseId)
        if (isFavorite) throw new CourseAlreadyLikedError(`O usuário ${userId} já tem o curso ${courseId} na lista de curtidas`)

        const like = await Like.create({
            userId,
            courseId
        })

        return like
    }

    async delete(userId: number, courseId: number){
        await this.usersQueryService.findById(userId)
        await this.coursesQueryService.findById(courseId)
        const isFavorite = await this.likesQueryService.isLiked(userId, courseId)
        if (!isFavorite) throw new ModelNotFoundError(`O usuário ${userId} não tem o curso ${courseId} na sua lista de curtidas`)

        await Like.destroy({where: {
            userId,
            courseId
        }})
    }
}