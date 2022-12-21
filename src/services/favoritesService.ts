import { Favorite } from "../models"

export const favoritesService = {
	create: async (userId: number, courseId: number) => {
        const favorite = await Favorite.create({ userId, courseId})
        return favorite
    },
}