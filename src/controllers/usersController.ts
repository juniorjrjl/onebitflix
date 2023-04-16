import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest, ensure } from '../middlewares/auth'
import UsersQueryService from "../services/queries/usersQueryService";
import UsersService from "../services/usersService";
import { checkValidators } from "../validatos/validatorUtils";
import { showSerializer, updateSerializer, watchingSerializer } from "../serializers/usersSerializer";
import { GET, PUT, before, route } from "awilix-express";
import { userChangePasswordValidtators, userUpdateValidators } from "../validatos/usersValidators";

@route('/users/current')
export default class UsersController{

    constructor(private readonly usersService: UsersService,
                private readonly usersQueryService: UsersQueryService){}

    /**
     * @swagger
     * /users/current/watching:
     *   get:
     *     tags:
     *       - Users
     *     summary: Episódios não concluidos
     *     description: retorna uma lista de episódios que o usuário começou a assistir e não concluiu
     *     responses:
     *       200:
     *         description: lista de episodios
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: 
     *                 $ref: '#/components/schemas/WatchingResponse'
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
    @route('/watching')
    @GET()
    @before([ensure])
    async watching(req: AuthenticatedRequest, res: Response, next: NextFunction){
        const { id } = req.user!
        try{
            const watching = await this.usersQueryService.getKeepWatchingList(id)
            return res.json(watchingSerializer(watching))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /users/current:
     *   get:
     *     tags:
     *       - Users
     *     summary: Informações do usuário
     *     description: Obtem informações do usuário logado
     *     responses:
     *       200:
     *         description: informações do usuário
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserShowResponse'
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
    async show(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            const currentUser = req.user!
            return res.json(showSerializer(currentUser))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /users/current:
     *   put:
     *     tags:
     *       - Users
     *     summary: Atualizar dados
     *     description: Atualiza informações do usuário
     *     requestBody:
     *       description: Dados para atualizar
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserUpdateRequest'
     *     responses:
     *       200:
     *         description: Informações atualizadas
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserUpdateResponse'
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
    @PUT()
    @before([ensure, userUpdateValidators()])
    async update(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            checkValidators(req)
            const { id } = req.user!
            const { firstName, lastName, phone, birth, email } = req.body
            const updatedUser = await this.usersService.update(id, {firstName, lastName, phone, birth, email})
            return res.json(updateSerializer(updatedUser))
        } catch (err) {
            next(err)
        }
    }

    /**
     * @swagger
     * /users/current/password:
     *   put:
     *     tags:
     *       - Users
     *     summary: Alterar senha
     *     description: Altera a senha do usuário
     *     requestBody:
     *       description: Dados para atualizar
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ChangePassword'
     *     responses:
     *       204:
     *         description: Senha alterada com sucesso
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
    @route('/password')
    @PUT()
    @before([ensure, userChangePasswordValidtators()])
    async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try{
            checkValidators(req)
            const user = req.user!
            const { currentPassword, passwordConfirm, newPassword } = req.body
            
            await this.usersQueryService.checkPassword(currentPassword, user)
            await this.usersService.updatePassword(user!.id, newPassword)
            return res.status(StatusCodes.NO_CONTENT).send()

        } catch (err) {
            next(err)
        }
    }

}

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints para gerenciamento de usuários
 * components:
 *   schemas:
 *     WatchingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do episódio
 *         name:
 *           type: string
 *           example: Introdução
 *           description: Título da aula
 *         synopsis:
 *           type: string
 *           example: Aula de introdução do curso
 *           description: explicação detalhada da aula
 *         order:
 *           type: integer
 *           format: int32
 *           example: 1
 *           description: Número sequencial para indicação da ordem dos episódios
 *         videoUrl:
 *           type: string
 *           example: /example/teste.mp4
 *           description: path no servidor onde o vídeo está armazenado
 *         secondsLong:
 *           type: integer
 *           format: int64
 *           example: 60
 *           description: duração do vídeo em segundos
 *         watchTime:
 *             properties:
 *               seconds:
 *                 type: integer
 *                 format: int64
 *                 example: 500
 *                 description: tempo em segundos onde o usuário parou de assistir
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-04-05T22:00:00Z
 *                 description: data de criação do curso
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-04-05T22:00:00Z
 *                 description: data da última atualização do curso
 *         course:
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
 *               featured:
 *                 type: boolean
 *                 example: true
 *                 description: Informa se u curso está em destaque
 *               categoryId:
 *                 type: integer
 *                 format: int64
 *                 example: 1
 *                 description: Referência a categoria
 *     UserShowResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do usuário
 *         firstName:
 *           type: string
 *           example: João
 *           description: Primeiro nome do usuário
 *         lastName:
 *           type: string
 *           example: da Silva
 *           description: Sobremone do usuário
 *         phone:
 *           type: string
 *           example: (19) 98552-5656
 *           description: Telefone do usuário
 *         birth:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data de nascimento do usuário
 *         email:
 *           type: string
 *           example: joao.silva@email.com
 *           description: e-mail do usuário
 *         role:
 *           type: string
 *           example: user
 *           description: informa se o usuário é um estudante (user) ou administrador (admin)
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: João
 *           description: Primeiro nome do usuário
 *         lastName:
 *           type: string
 *           example: da Silva
 *           description: Sobremone do usuário
 *         phone:
 *           type: string
 *           example: (19) 98552-5656
 *           description: Telefone do usuário
 *         birth:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data de nascimento do usuário
 *         email:
 *           type: string
 *           example: joao.silva@email.com
 *           description: e-mail do usuário
 *     UserUpdateResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *           description: Identificador do usuário
 *         firstName:
 *           type: string
 *           example: João
 *           description: Primeiro nome do usuário
 *         lastName:
 *           type: string
 *           example: da Silva
 *           description: Sobremone do usuário
 *         phone:
 *           type: string
 *           example: (19) 98552-5656
 *           description: Telefone do usuário
 *         birth:
 *           type: string
 *           format: date-time
 *           example: 2023-04-05T22:00:00Z
 *           description: data de nascimento do usuário
 *         email:
 *           type: string
 *           example: joao.silva@email.com
 *           description: e-mail do usuário
 *         role:
 *           type: string
 *           example: user
 *           description: informa se o usuário é um estudante (user) ou administrador (admin)
 *     ChangePassword:
 *       type: object
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: 123456
 *           description: senha atual do usuário
 *         newPassword:
 *           type: string
 *           example: 1234567
 *           description: nova senha do usuário
 *         passwordConfirm:
 *           type: string
 *           example: 1234567
 *           description: confirmação da nova senha do usuário
 */