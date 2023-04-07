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

    /**
     * @swagger
     * /episodes/stream:
     *   get:
     *     tags:
     *       - Episodes
     *     parameters:
     *       - name: videoUrl
     *         in: query
     *         description: path do vídeo no servidor
     *         schema:
     *           type: string
     *           example: /example/teste.mp4
     *     summary: Video
     *     description: Busca o vídeo do episódio
     *     responses:
     *       200:
     *         description: Retorna o mp4 do episódio
     *         content:
     *           video/mp4:
     *             schema:
     *               type: string
     *               format: binary
     *       400:
     *         description: Erro na requisição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorParamResponse'
     *       401:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Recurso não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    stream: async (req: Request, res: Response, next: NextFunction) =>{
        try{
            checkValidators(req)
            const { videoUrl } = req.query
            const range = req.headers.range
            const videoInfo = episodesQueryService.streamEpisodeToresponse(res, videoUrl as string, range)
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

    /**
     * @swagger
     * /episodes/{id}/watchTime:
     *   get:
     *     tags:
     *       - Episodes
     *     parameters:
     *       - name: id
     *         in: path
     *         description: identificador do vídeo
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Retomar de onde parou
     *     description: Retorna o momento onde o vídeo foi interrompido para retoma-lo desse ponto
     *     responses:
     *       200:
     *         description: Retorna informações do momento de interrupção
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetWatchTimeResponse'
     *       400:
     *         description: Erro na requisição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorParamResponse'
     *       401:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Recurso não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
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

    /**
     * @swagger
     * /episodes/{id}/watchTime:
     *   post:
     *     tags:
     *       - Episodes
     *     parameters:
     *       - name: id
     *         in: path
     *         description: identificador do vídeo
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Criar ponto de retomada
     *     description: Armazena o momento que o vídeo foi interrompido para retoma-lo posteriormente
     *     requestBody:
     *       description: Cria um ponto de retomada
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SetWatchTimeRequest'
     *     responses:
     *       201:
     *         description: Momento salvo
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SetWatchTimeResponse'
     *       400:
     *         description: Erro na requisição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorParamResponse'
     *       401:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Recurso não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
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

/**
 * @swagger
 * tags:
 *   - name: Episodes
 *     description: Endpoints para gerenciamento de episódios
 * components:
 *   schemas:
 *     GetWatchTimeResponse:
 *       type: object
 *       properties:
 *         epidodeId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do episódio
 *         seconds:
 *           type: number
 *           format: int64
 *           example: 200
 *           description: momento em que a última transmissão foi interrompida
 *     SetWatchTimeRequest:
 *       type: object
 *       properties:
 *         seconds:
 *           type: number
 *           format: int64
 *           example: 200
 *           description: momento do episódio que foi transmitido
 *     SetWatchTimeResponse:
 *       type: object
 *       properties:
 *         epidodeId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do episódio
 *         seconds:
 *           type: number
 *           format: int64
 *           example: 200
 *           description: momento em que a última transmissão foi interrompida
 */