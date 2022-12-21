import { Like } from "../../models"

export const likesQueryService = {

    isLiked: async (userId: number, courseId: number): Promise<boolean>=>{
        const like = await Like.findOne({where: {
            userId,
            courseId
        }})
        return like !== null
    }

}