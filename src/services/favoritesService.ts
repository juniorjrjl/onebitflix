import { Favorite } from "../models"

export const favoritesService = {
	create: async (userId: number, courseId: number) => {
        const favorite = await Favorite.create({ userId, courseId})
        return favorite
    },
    delete: async(userId: number, courseId: number) =>{
        await Favorite.destroy({
            where:{
                userId,
                courseId
            }
        })
    }
}