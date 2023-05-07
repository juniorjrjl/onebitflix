import path from "path"
import { statSync, createReadStream } from 'fs'
import { VideoInfo } from "../../dto/videoInfo";
import { Episode, WatchTime } from "../../models";
import { ModelNotFoundError } from "../../errors/modelNotFoundError";

export default class EpisodesQueryService{
    async streamEpisodeToResponse(videoUrl: string, range: string | undefined){
        const filePath = path.join(__dirname, '..', '..', '..','uploads', videoUrl)
        const fileStat = statSync(filePath)

        if (range){
            const parts = range.replace(/bytes=/, '').split('-')
            const start = parseInt(parts[0], 10)
            const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1
            const chunkSize = (end - start) + 1
            const file = createReadStream(filePath, { start, end })
            return VideoInfo.partialVideBuilder()
                .contentLength(chunkSize)
                .contentRange(`bytes ${start}-${end}/${fileStat.size}`)
                .file(file)
                .build()
        }else{
            return VideoInfo.fullVideoBuilder()
                .filePath(filePath)
                .fileStats(fileStat)
                .build()
        }
    }

    async getWatchTime(userId: number, episodeId: number){
        const watchTime = await WatchTime.findOne({
            attributes: ['seconds'],
            where: {
                userId,
                episodeId
            }
        })
        if (!(watchTime)) throw new ModelNotFoundError(`O usuário ${userId} não começou a assistir o episódio ${episodeId}`)

        return watchTime
    }

    async findByUserIdAndEpisodeId(userId: number, episodeId: number){
        const watchTime = await WatchTime.findOne({
            where: {
                userId,
                episodeId
            }
        })
        if (!(watchTime)) throw new ModelNotFoundError(`O usuário ${userId} não começou a assistir o episódio ${episodeId}`)

        return watchTime
    }

    async findById(id: number){
        const episode = await Episode.findByPk(id)
        if (!(episode)) throw new ModelNotFoundError(`Não foi encontrado um episódio com id ${id}`)
        
        return episode
    }
}