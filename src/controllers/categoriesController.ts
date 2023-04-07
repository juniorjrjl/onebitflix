import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { getIdNumber } from "../helpers/paramConverter";
import { categoriesQueryService } from "../services/queries/categoriesQueryService";
import { checkValidators } from "../validatos/validatorUtils";
import { indexSerializer, showSerializer } from "../serializers/categoriesSerializer";

export const categoriesController = {

    /**
     * @swagger
     * /categories:
     *   get:
     *     tags:
     *       - Categories
     *     parameters:
     *       - name: page
     *         in: query
     *         description: número da página solicitada ( começa em 1 )
     *         default: 1
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *       - name: perPage
     *         in: query
     *         description: quantidade de registros retornadas (mínimo 10 máximo 50)
     *         default: 10
     *         schema:
     *           type: integer
     *           format: int32
     *           example: 1
     *     summary: Listar categorias
     *     description: Busca categorias cadastradas por demanda
     *     responses:
     *       200:
     *         description: Lista de categorias
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryPaged'
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
    index: async (req: Request, res: Response, next: NextFunction) => {
        try{
            checkValidators(req)
            const [page, perPage] = getPaginationParams(req.query)
            const paginated = await categoriesQueryService.findAllPaginated(page, perPage)
            return res.json(indexSerializer(paginated))
        }catch(err){
            next(err)
        }
    },

    /**
     * @swagger
     * /categories/{id}:
     *   get:
     *     tags:
     *       - Categories
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Identificador da categoria
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Busca de categoria pelo id
     *     description: Busca os detalhes de uma categoria pelo seu identificador
     *     responses:
     *       200:
     *         description: Detalhes da categoria
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryShow'
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
    show: async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkValidators(req)
            const id = getIdNumber(req.params)
            const category = await categoriesQueryService.findByIdWithCourses(id)
            return res.json(showSerializer(category!))
        } catch (err) {
            next(err)
        }
    }

}

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Endpoints para gerenciamento de categorias
 * components:
 *   schemas:
 *     CategoryShow:                
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador da categoria
 *         name:
 *           type: string
 *           example: Backent
 *           description: nome da categoria
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
 *                 description: Título do curso
 *               synopsis:
 *                 type: string
 *                 example: Aprenda Java avançado
 *                 description: explicação detalhada do curso
 *               thumbnailUrl:
 *                 type: string
 *                 example: /example/teste.png
 *                 description: path no servidor onde a imagem está armazenada
 *     CategoryPaged:
 *       allOf: 
 *         - $ref: '#/components/schemas/AbtractPaged'
 *         - type: object
 *       properties:
 *         content:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryContent'
 *     CategoryContent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador da categoria
 *         name:
 *           type: string
 *           example: Backend
 *           description: Nome da categoria
 *         position:
 *           type: integer
 *           format: int32
 *           example: 1
 *           description: atributo para ordenação das categorias
 */