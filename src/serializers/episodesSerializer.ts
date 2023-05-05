import { WatchTime } from "../models"

export const getWatchTimeSerializer = (watchTime: WatchTime) =>{
    return{
        episodeId: watchTime.episodeId,
        seconds: watchTime.seconds
    }
}

export const setWatchTimeSerializer = (watchTime: WatchTime) =>{
    return{
        episodeId: watchTime.episodeId,
        seconds: watchTime.seconds
    }
}