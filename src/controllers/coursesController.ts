import { NextFunction, Request, Response } from "express"
import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { getPaginationParams } from "../helpers/getPaginationParams"
import { getIdNumber } from "../helpers/paramConverter"
import { AuthenticatedRequest, ensure } from "../middlewares/auth"
import CoursesQueryService from "../services/queries/coursesQueryService"
import FavoritesQueryService from "../services/queries/favoritesQueryService"
import LikesQueryService from "../services/queries/likesQueryService"
import { checkValidators } from "../validatos/validatorUtils"
import { featuredSerializer, newestSerializer, popularSerializer, searchSerializer, showSerializer } from "../serializers/coursesSerializer"
import { GET, before, route } from "awilix-express"
import { courseShowValidators, coursesSearchValidators } from "../validatos/coursesValidators"

@route('/courses')
export default class CoursesController{

    constructor(private readonly coursesQueryService: CoursesQueryService,
                private readonly favoritesQueryService: FavoritesQueryService,
                private readonly likesQueryService: LikesQueryService){}

    /**
     * @swagger
     * /courses/featured:
     *   get:
     *     tags:
     *       - Courses
     *     summary: Destaques
     *     description: Busca 3 cursos em destaque de forma aleatória
     *     responses:
     *       200:
     *         description: lista de cursos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: 
     *                 $ref: '#/components/schemas/CourseFeatured'
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
    @route('/featured')
    @before([ensure])
    async featured(req: Request, res: Response, next: NextFunction){
        try {
            const featured = await this.coursesQueryService.getRandomFeaturedCourses()
            return res.json(featuredSerializer(featured))
        } catch (err) {
            next(err)
        }
    }
    
    /**
     * @swagger
     * /courses/newest:
     *   get:
     *     tags:
     *       - Courses
     *     summary: Mais novos
     *     description: Busca os 10 últimos lançamentos
     *     responses:
     *       200:
     *         description: lista de cursos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: 
     *                 $ref: '#/components/schemas/CourseNewests'
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
    @route('/newest')
    async newest(req: Request, res: Response, next: NextFunction){
        try {
            const newest = await this.coursesQueryService.getTopTenNewest()
            return res.json(newestSerializer(newest))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /courses/{id}:
     *   get:
     *     tags:
     *       - Courses
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Identificador do curso
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *           example: 1
     *     summary: Busca de curso pelo id
     *     description: Busca os detalhes de um curso pelo seu identificador
     *     responses:
     *       200:
     *         description: Detalhes do curso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CourseShow'
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
    @route('/:id')
    @before([ensure, courseShowValidators()])
    async show(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            checkValidators(req)
            const courseId = getIdNumber(req.params)
            const userId = req.user!.id
            const course = await this.coursesQueryService.findByIdWithEpisodes(courseId)

            const liked = await this.likesQueryService.isLiked(userId, courseId)
            const favorited = await this.favoritesQueryService.isFavorited(userId, courseId)
            return res.json(showSerializer(course, liked, favorited))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /courses/search:
     *   get:
     *     tags:
     *       - Courses
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
     *     summary: Listar cursos
     *     description: Busca cursos cadastrados por demanda
     *     responses:
     *       200:
     *         description: Lista de cursos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CoursePaged'
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
    @route('/search')
    @before([coursesSearchValidators()])
    async search(req: Request, res: Response, next: NextFunction){
        try {
            checkValidators(req)
            let { name } = req.query
            const [page, perPage ] = getPaginationParams(req.query)
            if (typeof name !== 'string') name = undefined
            const courses = await this.coursesQueryService.findByName(page, perPage, name)
            return res.json(searchSerializer(courses))
        } catch (err) {
            next(err)
        }
    }


    /**
     * @swagger
     * /courses/popular:
     *   get:
     *     tags:
     *       - Courses
     *     summary: Busca top 10
     *     description: Busca os 10 cursos mais curtidos
     *     responses:
     *       200:
     *         description: lista de cursos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: 
     *                 $ref: '#/components/schemas/CoursePopular'
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
    @route('/popular')
    @before([ensure])
    async popular(req: Request, res: Response, next: NextFunction){
        try {
            const topTen = await this.coursesQueryService.getTopTenByLikes()
            res.json(popularSerializer(topTen))
        } catch (err) {
            next(err)
        }
    }
}

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Endpoints para gerenciamento de cursos
 * components:
 *   schemas:
 *     CourseShow:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         name:
 *           type: string
 *           example: Java Avançado
 *           description: nome do curso
 *         synopsis:
 *           type: string
 *           example: Curso que aborda tópicos avançados de Java
 *           description: explicação detalhada do curso
 *         thumbnailUrl:
 *           type: string
 *           example: /example/teste.png
 *           description: path no servidor onde a thumbnailUrl está armazenada
 *         liked:
 *           type: boolean
 *           example: true
 *           description: informa se o curso recebeu like do usuário logado
 *         favorited:
 *           type: boolean
 *           example: true
 *           description: informa se o curso foi favoritado pelo usuário logado
 *         episodes: 
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 format: int64
 *                 example: 1
 *                 description: Identificador do episódio
 *               name:
 *                 type: string
 *                 example: Introdução
 *                 description: Título da aula
 *               synopsis:
 *                 type: string
 *                 example: Aula de introdução do curso
 *                 description: explicação detalhada da aula
 *               order:
 *                 type: integer
 *                 format: int32
 *                 example: 1
 *                 description: Número sequencial para indicação da ordem dos episódios
 *               videoUrl:
 *                 type: string
 *                 example: /example/teste.mp4
 *                 description: path no servidor onde o vídeo está armazenado
 *               secondsLong:
 *                 type: integer
 *                 format: int64
 *                 example: 60
 *                 description: duração do vídeo em segundos
 *     CoursePopular:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         name:
 *           type: string
 *           example: Java Avançado
 *           description: nome do curso
 *         synopsis:
 *           type: string
 *           example: Curso que aborda tópicos avançados de Java
 *           description: explicação detalhada do curso
 *         thumbnailUrl:
 *           type: string
 *           example: /example/teste.png
 *           description: path no servidor onde a thumbnailUrl está armazenada
 *         liked:
 *           type: boolean
 *           example: true
 *           description: informa se o curso recebeu like do usuário logado
 *         favorited:
 *           type: boolean
 *           example: true
 *           description: informa se o curso foi favoritado pelo usuário logado
 *         episodes: 
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 format: int64
 *                 example: 1
 *                 description: Identificador do episódio
 *               name:
 *                 type: string
 *                 example: Introdução
 *                 description: Título da aula
 *               synopsis:
 *                 type: string
 *                 example: Aula de introdução do curso
 *                 description: explicação detalhada da aula
 *               order:
 *                 type: integer
 *                 format: int32
 *                 example: 1
 *                 description: Número sequencial para indicação da ordem dos episódios
 *               videoUrl:
 *                 type: string
 *                 example: /example/teste.mp4
 *                 description: path no servidor onde o vídeo está armazenado
 *               secondsLong:
 *                 type: integer
 *                 format: int64
 *                 example: 60
 *                 description: duração do vídeo em segundos
 *     AbtractPaged:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: página atual
 *         perPage: 
 *           type: integer
 *           format: int32
 *           example: 10
 *           description: quantidade de registros por página
 *         total: 
 *           type: integer
 *           format: int32
 *           example: 10
 *           description: quantidade de registros retornados
 *     CoursePaged:
 *       allOf: 
 *         - $ref: '#/components/schemas/AbtractPaged'
 *         - type: object
 *       properties:
 *         content:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseContent'
 *     CourseContent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         name:
 *           type: string
 *           example: Java Avançado
 *           description: Título do curso
 *         synopsis:
 *           type: string
 *           example: Curso que aborda tópicos avançados de Java
 *           description: explicação detalhada do curso
 *         thumbnailUrl:
 *           type: string
 *           example: /example/teste.png
 *           description: path no servidor onde a thumbnailUrl está armazenada
 *     CourseNewests:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         name:
 *           type: string
 *           example: Java Avançado
 *           description: nome do curso
 *         synopsis:
 *           type: string
 *           example: Curso que aborda tópicos avançados de Java
 *           description: explicação detalhada do curso
 *         thumbnailUrl:
 *           type: string
 *           example: /example/teste.png
 *           description: path no servidor onde a thumbnailUrl está armazenada
 *         featured:
 *           type: boolean
 *           example: true
 *           description: informa se o curso foi marcado como destaque
 *         categoryId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: referência à categoria que o curso pertence
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data de criação do curso
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data da última atualização do curso
 *     CourseFeatured:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do curso
 *         name:
 *           type: string
 *           example: Java Avançado
 *           description: nome do curso
 *         synopsis:
 *           type: string
 *           example: Curso que aborda tópicos avançados de Java
 *           description: explicação detalhada do curso
 *         thumbnailUrl:
 *           type: string
 *           example: /example/teste.png
 *           description: path no servidor onde a thumbnailUrl está armazenada
 *         featured:
 *           type: boolean
 *           example: true
 *           description: informa se o curso foi marcado como destaque
 *         categoryId:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: referência à categoria que o curso pertence
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data de criação do curso
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data da última atualização do curso
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: aconteceu um erro inesperado
 *           description: mensagem com informações do erro
 *         status:
 *           type: integer
 *           format: int32
 *           example: 500
 *           description: status code da requisição
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: date e hora que o erro aconteceu
 *     ErrorParamResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: a requisição contém erros
 *           description: mensagem com informações do erro
 *         status:
 *           type: integer
 *           format: int32
 *           example: 400
 *           description: status code da requisição
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: date e hora que o erro aconteceu
 *         fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field: 
 *                 type: string
 *                 example: id
 *                 description: propriedade do body,query string e/ou url que contém o erro
 *               message: 
 *                 type: string
 *                 example: informe um identificador válido
 *                 description: descrição do erro que aconteceu
 */