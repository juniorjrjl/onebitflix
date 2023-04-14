import { Like } from "../../models"

export default class LikesQueryService{

    async isLiked(userId: number, courseId: number): Promise<boolean>{
        const like = await Like.findOne({where: {
            userId,
            courseId
        }})
        return like !== null
    }

}