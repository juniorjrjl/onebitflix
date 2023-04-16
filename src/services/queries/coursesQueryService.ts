import { Op } from "sequelize"
import { Course, Episode } from "../../models"
import { ModelNotFoundError } from "../../errors/modelNotFoundError"

export default class CoursesQueryService{

    async findByIdWithEpisodes(id: number){
        const courseWithEpisodes = Course.findByPk(id, {
            attributes:[
                'id',
                'name',
                'synopsis',
                ['thumbnail_url', 'thumbnailUrl']
            ],
            include:{
                model: Episode,
                attributes: [
                    'id',
                    'name',
                    'synopsis',
                    'order',
                    ['video_url', 'videoUrl'],
                    ['seconds_long', 'secondsLong']
                ],
                order: [['order', 'ASC']],
                separate: true
            }
        })
        return courseWithEpisodes
    }

    async getRandomFeaturedCourses(){
        const featuredCourses = await Course.findAll({
                attributes:[
                'id',
                'name',
                'synopsis',
                ['thumbnail_url', 'thumbnailUrl']
            ], 
            where: {
                featured: true
            }
        })
        const randomFeaturedCourses = featuredCourses.sort(() => 0.5 - Math.random())
        return randomFeaturedCourses.slice(0, 3)
    }

    async getTopTenNewest(){
        const coures = await Course.findAll({
            limit: 10,
            order: [['created_at', 'DESC']]
        })
        return coures
    }

    async getTopTenByLikes(){
        const result = await Course.sequelize?.query(`
            SELECT courses.id,
                   course.name,
                   course.synopsis,
                   course.thumbnial_url as thumbnialUrl,
                   COUNT(user.id) as likes
              FROM courses
              LEFT JOIN likes
                ON courses.id = likes.course_id
             INNER JOIN users
                ON users.id = likes.user_id
             GROUP BY courses.id
             ORDER BY likes DESC
             LIMIT 10
        `)
        if (!result) return null
        
        const [topTen] = result
        return topTen
    }

    async findByName(page: number, perPage: number, name?: string){
        const offset = (page -1) * perPage
        const where = name ? 
        {
            name: {
                [Op.iLike]: `%${name}%`
            }
        } : 
        {}
        const {count, rows} = await Course.findAndCountAll({
            attributes:[
                'id',
                'name',
                'synopsis',
                ['thumbnail_url', 'thumbnailUrl']
            ], 
            where,
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

    async findById(id: number){
        const user = await Course.findByPk(id)
        if (!user) throw new ModelNotFoundError(`Não foi encontrado um curso com id ${id}`)
        return user
    }

}