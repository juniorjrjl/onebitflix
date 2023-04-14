import { Course, Episode, User } from "../../models"
import { EpisodeInstance } from "../../models/Episode"
import bcrypt from 'bcrypt'
import { ModelNotFoundError } from "../../errors/modelNotFoundError"
import { UnauthorizedError } from "../../errors/unauthorizedError"

const filterLastEpisodesByCourse = (episodes: EpisodeInstance[]) => {
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

export default class UsersQueryService{
    async findByEmail(email: string){
        const user = await User.findOne({where: { email }})
        if (!user) throw new ModelNotFoundError(`Não existe um usuário cadastrado com o email ${email}`)
        return user
    }

    async getKeepWatchingList(id: number){
        const userWithWatchingEpisodes = await User.findByPk(id, {
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
        if (!userWithWatchingEpisodes) throw new Error('Usuário não encontrado')

        const keepWatchingList = filterLastEpisodesByCourse(userWithWatchingEpisodes.Episodes!)
        keepWatchingList.sort((a, b) => a.watchTime!.updatedAt < b.watchTime!.updatedAt ? 1 : 0) 
        return keepWatchingList
    }

    async checkPassword(password: string, user: User){
        const isSame = await bcrypt.compare(password, user.password)
        if (!isSame) throw new UnauthorizedError('Senha incorreta')
        return isSame
    }
}