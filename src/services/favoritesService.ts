import { Favorite } from "../models"

export default class FavoritesService{
	async create(userId: number, courseId: number){
        const favorite = await Favorite.create({ userId, courseId})
        return favorite
    }

    async delete(userId: number, courseId: number){
        await Favorite.destroy({
            where:{
                userId,
                courseId
            }
        })
    }
}