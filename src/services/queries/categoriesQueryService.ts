import { Category, Course } from "../../models"

export const categoriesQueryService = {
    findAllPaginated: async(page: number, perPage: number) => {
        const offset = (page - 1) * perPage
        const {count, rows} = await Category.findAndCountAll({
            attributes: ['id', 'name', 'position'],
            order: [['position', 'ASC']],
            limit: perPage,
            offset
        })
        return {
            content: rows, 
            page, 
            perPage, 
            total: count
        }
    },

    findByIdWithCourses:async (id: number) => {
        const categoryWithCourser = await Category.findByPk(id, { 
            attributes: ['id', 'name'], 
            include: { 
                model: Course,
                attributes: ['id', 'name', 'synopsis', ['thumbnail_url', 'thumbnailUrl']]
            } })
        return categoryWithCourser
    } 

}