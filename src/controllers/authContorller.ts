import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import JwtService from "../services/jwtService";
import UsersService from "../services/usersService";
import UsersQueryService from "../services/queries/usersQueryService";
import { PayloadDTO } from "../dto/payloadDTO";
import { checkValidators } from "../validatos/validatorUtils";
import { loginSerializer, registerSerializer } from "../serializers/authSerializer";
import { POST, before, route } from "awilix-express";
import { authLoginValidators, authRegisterValidators } from "../validatos/authValidator";
import { ModelNotFoundError } from "../errors/modelNotFoundError";
import { UnauthorizedError } from "../errors/unauthorizedError";

@route('/auth')
export default class AuthController{

    constructor(private readonly jwtService: JwtService,
                private readonly usersService: UsersService,
                private readonly usersQueryService: UsersQueryService){}

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Registrar
     *     description: Registra um usuário como 'user'
     *     requestBody:
     *       description: Dados cadastrais
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequest'
     *     responses:
     *       201:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RegisterResponse'
     *       400:
     *         description: Erro na requisição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorParamResponse'
     *       500:
     *         description: não autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    @route('/register')
    @POST()
    @before([authRegisterValidators()])
    async register(req: Request, res: Response, next: NextFunction){
        try{
            checkValidators(req)
            const { firstName, lastName, email, password, phone, birth } = req.body
            const user = await this.usersService.create({ firstName, lastName, email, password, phone, birth, role: 'user' })
            return res.status(StatusCodes.CREATED).json(registerSerializer(user))
        }catch(err){
            next(err)
        }
    }

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Logar na API
     *     description: Entra com as credenciais para realizar login
     *     requestBody:
     *       description: Dados para login
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       201:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       400:
     *         description: Erro na requisição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorParamResponse'
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
    @route('/login')
    @POST()
    @before([authLoginValidators()])
    async login(req: Request, res: Response, next: NextFunction) {
        try{
            checkValidators(req)
            const { email, password } = req.body
            try{
                const user = await this.usersQueryService.findByEmail(email)
                await this.usersQueryService.checkPassword(password, user)
                const payload = new PayloadDTO(user.id, user.firstName, user.email)
                const token = this.jwtService.sign(payload, '1d')
                return res.json(loginSerializer(token))
            }catch(ex){
                if ((ex instanceof ModelNotFoundError) || (ex instanceof UnauthorizedError)) throw new UnauthorizedError('Usuário e/ou senha incorretos')
            }
        }catch(err){
            next(err)
        }
    }

}

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints para gerenciamento de autenticação
 * components:
 *   schemas:
 *     RegisterRequest:
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
 *         password:
 *           type: string
 *           example: 123456
 *           description: senha do usuário
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
 *     RegisterResponse:
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
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: joao.silva@email.com
 *           description: e-mail do usuário
 *         password:
 *           type: string
 *           example: 123456
 *           description: senha do usuário
 *     LoginResponse:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: Bearer
 *           description: Tipo do token
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *           description: Token JWT
 *         expiresIn:
 *           type: integer
 *           format: int64
 *           example: 1680908940519
 *           description: Tempo de expiração do token em milisegundos
 */