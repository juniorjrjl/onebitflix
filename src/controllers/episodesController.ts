import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import fs from 'fs'
import { episodesQueryService } from "../services/episodesQueryService"

interface Head{
    [key: string]: any
}

export const episodesController = {

    stream: async (req: Request, res: Response) =>{
        const { videoUrl } = req.query
        try{
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
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }

}