import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest, ensure } from "../middlewares/auth";
import FavoritesQueryService from '../services/queries/favoritesQueryService';
import FavoritesService from '../services/favoritesService'
import { getIdNumber } from '../helpers/paramConverter';
import { checkValidators } from '../validatos/validatorUtils';
import { indexSerializer, saveSerializer } from '../serializers/favoritesSerializer';
import { DELETE, GET, POST, before, route } from 'awilix-express';
import { favoriteDeleteValidators, favoriteSaveValidators } from '../validatos/favoritesValidator';

@route('/favorites')
export default class FavoritesController{

    constructor(private readonly favoritesService: FavoritesService,
                private readonly favoritesQueryService: FavoritesQueryService){}

    /**
     * @swagger
     * /favorites:
     *   post:
     *     tags:
     *       - Favorites
     *     summary: Favoritar curso
     *     description: Marca um curso como favorito
     *     requestBody:
     *       description: Adiciona o curso como favorito
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SaveFavoriteRequest'
     *     responses:
     *       201:
     *         description: Curso favoritado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SaveFavoriteResponse'
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
    @before([ensure, favoriteSaveValidators()])
    async save(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {    
            checkValidators(req)
            const userId = req.user!.id
            const { courseId } = req.body
            const favorite = await this.favoritesService.create(userId, courseId)
            return res.status(StatusCodes.CREATED).json(saveSerializer(favorite))
        } catch (err) {
            next(err)
        }
    }
    
    /**
     * @swagger
     * /favorites:
     *   get:
     *     tags:
     *       - Favorites
     *     summary: Buscar favoritos
     *     description: Busca lista de favoritos de um usuário
     *     responses:
     *       200:
     *         description: retorno com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FavoritesBelongsToUser'
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
    @GET()
    @before([ensure])
    async index(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            const userId = req.user!.id
            const favorites = await this.favoritesQueryService.findByUserId(userId)
            return res.json(indexSerializer(favorites))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /favorites/{id}:
     *   delete:
     *     tags:
     *       - Favorites
     *     parameters:
     *       - name: id
     *         in: path
     *         description: identificador do curso
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Remover favorito
     *     description: Remove um curso dos favoritos
     *     responses:
     *       204:
     *         description: favorito removido com sucesso
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
    @before([ensure, favoriteDeleteValidators()])
    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            checkValidators(req)
            const userId = req.user!.id
            const courseId = getIdNumber(req.params)
            await this.favoritesService.delete(userId, courseId)
            return res.status(StatusCodes.NO_CONTENT).send()
        } catch (err) {
            next(err)
        }
    }
}

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Endpoints para gerenciamento de favoritos
 * components:
 *   schemas:
 *     SaveFavoriteRequest:
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *     SaveFavoriteResponse:
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
 *     FavoritesBelongsToUser:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           format: int64
 *           example: 200
 *           description: identificador do usuário
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 format: int64
 *                 example: 1
 *                 description: Identificador do curso
 *               name:
 *                 type: string
 *                 example: Java Avançado
 *                 description: nome do curso
 *               synopsis:
 *                 type: string
 *                 example: Curso que aborda tópicos avançados de Java
 *                 description: explicação detalhada do curso
 *               thumbnailUrl:
 *                 type: string
 *                 example: /example/teste.png
 *                 description: path no servidor onde a thumbnailUrl está armazenada
 */