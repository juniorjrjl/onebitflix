import { Response } from "express";
import path from "path"
import fs from 'fs'
import { StatusCodes } from "http-status-codes";
import { VideoInfo } from "../dto/videoInfo";

export const episodesQueryService = {
    streamEpisodeToresponse: (res: Response, videoUrl: string, range: string | undefined): VideoInfo => {
        const filePath = path.join(__dirname, '..', '..', 'uploads', videoUrl)
            const fileStat = fs.statSync(filePath)
            
            if (range){
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1
                const chunkSize = (end - start) + 1
                const file = fs.createReadStream(filePath, { start, end })
                //res.writeHead(StatusCodes.PARTIAL_CONTENT, head)
                //file.pipe(res)
                return VideoInfo.partialVideBuilder()
                    .contentLength(chunkSize)
                    .contentRange(`bytes ${start}-${end}/${fileStat.size}`)
                    .file(file)
                    .build()
            }else{
                //res.writeHead(StatusCodes.OK, head)
                //fs.createReadStream(filePath).pipe(res)
                return VideoInfo.fullVideoBuilder()
                    .filePath(filePath)
                    .fileStats(fileStat)
                    .build()
            }
    }
}