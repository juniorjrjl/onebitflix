import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getIdNumber } from '../helpers/paramConverter'
import { AuthenticatedRequest, ensure } from '../middlewares/auth'
import LikesService from '../services/likesService'
import { checkValidators } from '../validatos/validatorUtils'
import { saveSerializer } from '../serializers/likesSerializer'
import { DELETE, POST, before, route } from 'awilix-express'
import { likeDeleteValidators, likeSaveValidators } from '../validatos/likesValidator'

@route('/likes')
export default class LikesController{

    constructor(private readonly likesService: LikesService){}

    /**
     * @swagger
     * /likes:
     *   post:
     *     tags:
     *       - Likes
     *     summary: Curtir curso
     *     description: Marca um curso como curtido
     *     requestBody:
     *       description: Curtir
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SaveLikeRequest'
     *     responses:
     *       201:
     *         description: Curso curtido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SaveLikeResponse'
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
    @POST()
    @before([ensure, likeSaveValidators()])
    async save(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            checkValidators(req)
            const userId = req.user!.id
            const { courseId } = req.body
            const like = await this.likesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(saveSerializer(like))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /likes/{id}:
     *   delete:
     *     tags:
     *       - Likes
     *     parameters:
     *       - name: id
     *         in: path
     *         description: identificador do curso
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Remover curtida
     *     description: Remove curtida de um curso
     *     responses:
     *       204:
     *         description: curtida removido com sucesso
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
    @route('/:id')
    @DELETE()
    @before([ensure, likeDeleteValidators()])
    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            checkValidators(req)
            const userId = req.user!.id
            const courseId = getIdNumber(req.params)
            await this.likesService.delete(userId, courseId)
            return res.status(StatusCodes.NO_CONTENT).send()
        } catch (err) {
            next(err)
        }
    }
}

/**
 * @swagger
 * tags:
 *   - name: Likes
 *     description: Endpoints para gerenciamento de curtidas
 * components:
 *   schemas:
 *     SaveLikeRequest:
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *     SaveLikeResponse:
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         userId:
 *           type: number
 *           format: int64
 *           example: 200
 *           description: identificador do usuário
 */