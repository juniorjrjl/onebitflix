import { Op } from "sequelize"
import { Course, Episode } from "../../models"

export const coursesQueryService = {
    findByIdWithEpisodes: async (id: number) =>{
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
    },

    getRandomFeaturedCourses: async() =>{
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
    },

    getTopTenNewest: async() =>{
        const coures = await Course.findAll({
            limit: 10,
            order: [['created_at', 'DESC']]
        })
        return coures
    },

    getTopTenByLikes: async() =>{
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
    },

    findByName: async (page: number, perPage: number, name?: string) =>{
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
}