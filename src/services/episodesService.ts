import { WatchTime } from "../models"
import EpisodesQueryService from "./queries/episodesQueryService"
import UsersQueryService from "./queries/usersQueryService"

export default class EpisodesService{

    constructor(private readonly episodesQueryService: EpisodesQueryService,
                private readonly usersQueryService: UsersQueryService) {}

    async setWatchTime({ userId, episodeId, seconds }: WatchTime){
        await this.episodesQueryService.findById(episodeId)
        await this.usersQueryService.findById(userId)
        let watchTime = await this.episodesQueryService.findByUserIdAndEpisodeId(userId, episodeId)
        if (watchTime) {
            watchTime.seconds = seconds
            await watchTime.save()
            return watchTime
        } else {
            watchTime = await WatchTime.create({
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