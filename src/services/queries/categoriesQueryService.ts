import { ModelNotFoundError } from "../../errors/modelNotFoundError"
import { Category, Course } from "../../models"

export default class CategoriesQueryService{

    async findAllPaginated(page: number, perPage: number){
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
    }

    async findByIdWithCourses(id: number){
        const categoryWithCourser = await Category.findByPk(id, { 
            attributes: ['id', 'name'], 
            include: { 
                model: Course,
                attributes: ['id', 'name', 'synopsis', ['thumbnail_url', 'thumbnailUrl']]
            } })
        if (!(categoryWithCourser)) throw new ModelNotFoundError(`A categoria com id ${id} não foi encontrada`)

        return categoryWithCourser
    } 

}