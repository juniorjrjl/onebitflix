import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import fs from 'fs'
import { episodesQueryService } from "../services/queries/episodesQueryService"
import { AuthenticatedRequest } from "../middlewares/auth"
import { episodesService } from "../services/episodesService"
import { checkValidators } from "../validatos/validatorUtils"
import { getWatchTimeSerializer, setWatchTimeSerializer } from "../serializers/episodesSerializer"

interface Head{
    [key: string]: any
}

export const episodesController = {

    stream: async (req: Request, res: Response, next: NextFunction) =>{
        try{
            checkValidators(req)
            const { videoUrl } = req.query
            if (typeof videoUrl !== 'string') throw new Error('videoUrl param type must be a string')
            const range = req.headers.range
            const videoInfo = episodesQueryService.streamEpisodeToresponse(res, videoUrl, range)
            let head: Head = {
                'Content-Type' : 'video/mp4'
            }
            if (range){
                head['Accept-Ranges']  = 'bytes'
                head['Content-Range'] = videoInfo.ContentRange
                head['Content-Length'] = videoInfo.ContentLength
                res.writeHead(StatusCodes.PARTIAL_CONTENT, head)
                videoInfo.File!.pipe(res)
            } else {
                head['Content-Length'] = videoInfo.FileStats!.size
                res.writeHead(StatusCodes.OK, head)
                fs.createReadStream(videoInfo.FilePath!).pipe(res)
            }
        }catch(err){
            next(err)
        }
    },

    getWatchTime: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            checkValidators(req)
            const userId = req.user!.id
            const episodeId = req.params.id
            const watchTime = await episodesQueryService.getWatchTime(userId, Number(episodeId))
            return res.json(getWatchTimeSerializer(watchTime))
        } catch (err) {
            next(err)
        }
    },

    setWatchTime: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            checkValidators(req)
            const userId = req.user!.id
            const episodeId = Number(req.params.id)
            const { seconds } = req.body
            const watchTime = await episodesService.setWatchTime({
                episodeId,
                userId,
                seconds
            })
            return res.json(setWatchTimeSerializer(watchTime))
        } catch (err) {
            next(err)
        }
    }

}