import { Course, Favorite } from "../../models"

export const favoritesQueryService = {
    findByUserId:async (userId:number) => {
        const favorites = await Favorite.findAll({
            attributes: [['user_id', 'userId']],
            where:{
                userId
            }, 
            include:{ 
                model: Course,
                attributes: ['id', 'name', 'synopsis', ['thumbnail_url', 'thumbnailUrl']]
            }
        })
        return {
            userId,
            courses: favorites.map(f => f.Course)
        }
    }
}