import { Like } from "../models/"

export default class LikesService{

    async create(userId: number, courseId: number){
        const like = await Like.create({
            userId,
            courseId
        })

        return like
    }

    async delete(userId: number, courseId: number){
        await Like.destroy({where: {
            userId,
            courseId
        }})
    }
}