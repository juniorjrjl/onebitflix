import { Course, Episode, User } from "../../models"
import { EpisodeInstance } from "../../models/Episode"

const filterLastEpisodesBycourse = (episodes: EpisodeInstance[]) => {
    const coursesOnList: number[] = []

    const lastEpisodes = episodes.reduce((currentList, episode) => {
        if(!coursesOnList.includes(episode.courseId)){
            coursesOnList.push(episode.courseId)
            currentList.push(episode)
            return currentList
        }

        const episodeFromSameCourse = currentList.find(ep => ep.courseId === episode.courseId)
        if (episodeFromSameCourse!.order > episode.order) return currentList

        const listWithoutEpisodeFromSameCourse = currentList.filter(ep => ep.courseId !== episode.courseId)
        listWithoutEpisodeFromSameCourse.push(episode)
        return listWithoutEpisodeFromSameCourse
    }, [] as EpisodeInstance[])
    return lastEpisodes
}

export const usersQueryService = {
    findByEmail:async (email: string) =>{
        const user = await User.findOne({where: { email }})
        return user
    },

    getKeepWatchingList: async (id: number) => {
        const userWithTatchingEpisodes = await User.findByPk(id, {
            include:{
                model: Episode,
                attributes: ['id', 'name', 'synopsis', 'order', ['video_url', 'videoUrl'], ['seconds_long', 'secondsLong'], ['course_id', 'courseId']],
                include: [{
                    model: Course,
                    attributes: ['id', 'name', 'synopsis', ['thumbnail_url', 'thumbnailUrl']]
                }],
                through:{
                    attributes: ['seconds', ['updated_at', 'updatedAt']]
                }
            },
        })
        if (!userWithTatchingEpisodes) throw new Error('Usuário não encontrado')

        const keepWatchingList = filterLastEpisodesBycourse(userWithTatchingEpisodes.Episodes!)
        keepWatchingList.sort((a, b) => a.watchTime!.updatedAt < b.watchTime!.updatedAt ? 1 : 0) 
        return keepWatchingList
    }
}