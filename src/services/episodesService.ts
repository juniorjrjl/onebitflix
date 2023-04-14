import { WatchTime } from "../models"
import EpisodesQueryService from "./queries/episodesQueryService"

export default class EpisodesService{

    constructor(private readonly episodesQueryService: EpisodesQueryService) {}

    async setWatchTime({ userId, episodeId, seconds }: WatchTime){
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