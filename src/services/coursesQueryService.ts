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
    }
}