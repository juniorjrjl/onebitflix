import { Course, Episode } from "../models"

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
    }
}