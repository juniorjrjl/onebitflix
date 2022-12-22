import { WatchTime } from "../models"
import { WatchTimeAttributes } from "../models/WatchTime"
import { episodesQueryService } from "./queries/episodesQueryService"

export const episodesService = {
    setWatchTime: async ({ userId, episodeId, seconds }: WatchTimeAttributes) => {
        let watchTime = await episodesQueryService.findByUserIdAndEpisodeId(userId, episodeId)
        if (watchTime) {
            watchTime.seconds = seconds
            await watchTime.save()
            return watchTime
        } else {
            watchTime = await WatchTime.create({
                userId,
                episodeId,
                seconds
            })
            return watchTime
        }
    }
}