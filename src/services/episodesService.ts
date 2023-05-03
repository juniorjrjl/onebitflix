import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { WatchTime } from "../models"
import EpisodesQueryService from "./queries/episodesQueryService"
import UsersQueryService from "./queries/usersQueryService"

export default class EpisodesService{

    constructor(private readonly episodesQueryService: EpisodesQueryService,
                private readonly usersQueryService: UsersQueryService) {}

    async setWatchTime(userId: number, episodeId: number, seconds: number ){
        await this.episodesQueryService.findById(episodeId)
        await this.usersQueryService.findById(userId)
        try{
            let watchTime = await this.episodesQueryService.findByUserIdAndEpisodeId(userId, episodeId)
            watchTime.seconds = seconds
            await watchTime.save()
            return watchTime
        }catch(ex){
            if (!(ex instanceof ModelNotFoundError)) throw ex

            let watchTime = await WatchTime.create({
                userId,
                episodeId,
                seconds,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return watchTime
        }
    }
    
}