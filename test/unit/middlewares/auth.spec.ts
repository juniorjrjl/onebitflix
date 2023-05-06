import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest, ensure, ensureQuery, verifyCallback } from "../../../src/middlewares/auth"
import JwtService from "../../../src/services/jwtService"
import { JsonWebTokenError } from 'jsonwebtoken'
import UsersQueryService from "../../../src/services/queries/usersQueryService"
import { UnauthorizedError } from "../../../src/errors/unauthorizedError"
import container, { ICradle } from "../../../src/container";
import { AwilixContainer } from "awilix"
import { userFactory } from "../../factories/user"
import { UserInstance } from "../../../src/models/User"
import { query } from "express-validator"

jest.mock("../../../src/container", () => {return {
    __esModule: true,
    default: {
        cradle: {
            jwtService: jest.fn(),
            usersQueryService: jest.fn()
        }
    }
}})
jest.mock("../../../src/services/queries/usersQueryService")
jest.mock("../../../src/services/jwtService")

describe('Auth test', () => {
    
    const ContainerMock = container as jest.Mocked<AwilixContainer<ICradle>>
    const UsersQueryServiceMock = UsersQueryService as jest.Mock<UsersQueryService>
    const JwtServiceMock = JwtService as jest.Mock<JwtService>
    let containerMocked: AwilixContainer<ICradle>
    let usersQueryServiceMocked: UsersQueryService
    let jwtServiceMocked: JwtService
    let containerMockConfig: jest.Mocked<AwilixContainer<ICradle>>
    let usersQueryServiceMockConfig: jest.Mocked<UsersQueryService>
    let jwtServiceMockConfig: jest.Mocked<JwtService>

    beforeEach(() =>{
        UsersQueryServiceMock.mockClear()
        JwtServiceMock.mockClear()
        containerMocked = container as jest.Mocked<AwilixContainer<ICradle>>
        usersQueryServiceMocked = new UsersQueryService() as jest.Mocked<UsersQueryService>
        jwtServiceMocked = new JwtService() as jest.Mocked<JwtService>
        containerMockConfig = (containerMocked as jest.Mocked<AwilixContainer<ICradle>>)
        usersQueryServiceMockConfig = (usersQueryServiceMocked as jest.Mocked<UsersQueryService>)
        jwtServiceMockConfig = (jwtServiceMocked as jest.Mocked<JwtService>)
    })

    it.each([
        [undefined],
        ['teste']
    ])('when send invalid token in header then throw error', (authorization) =>{
        let request = {headers:{ authorization}} as Request
        const next = (ex: any) => expect(ex).toBeInstanceOf(UnauthorizedError)
        ensure(request, {} as Response, next)
    })

    it.each([
        [new JsonWebTokenError(''), ''],
        [null, undefined]
    ])('when error to verify token in query then throw error', (error, decoded) =>{
        containerMockConfig.cradle.jwtService = jwtServiceMockConfig
        let authorization = 'Bearer 123'
        let request = {headers:{ authorization}} as Request
        const next = (ex: any) => {}
        
        ensure(request, {} as Response, next)
        expect(jwtServiceMockConfig.verify).toHaveBeenCalled()
    })


    it.each([
        [undefined],
        ['teste']
    ])('when send invalid token in query then throw error', (authorization) =>{
        let request: any = { query: { token: undefined } }
        const next = (ex: any) => expect(ex).toBeInstanceOf(UnauthorizedError)
        ensureQuery(request, {} as Response, next)
    })

    it.each([
        [new JsonWebTokenError(''), ''],
        [null, undefined]
    ])('when error to verify token in query then throw error', (error, decoded) =>{
        containerMockConfig.cradle.jwtService = jwtServiceMockConfig
        let request: any = { query: { token: '123' } }
        const next = (ex: any) => {}
        
        ensureQuery(request, {} as Response, next)
        expect(jwtServiceMockConfig.verify).toHaveBeenCalled()
    })

    it('when callback not receive token then next receive expection', () =>{
        const next = (ex: any) => expect(ex).toBeInstanceOf(UnauthorizedError)
        let req = {} as Request
        verifyCallback(usersQueryServiceMockConfig, next, req)
    })

    it('when token has no stored user then next receive exception', () =>{
        usersQueryServiceMockConfig.findByEmail.mockRejectedValueOnce(new UnauthorizedError(''))
        const next = (ex: any) => expect(ex).toBeInstanceOf(UnauthorizedError)
        let req = {} as Request
        verifyCallback(usersQueryServiceMockConfig, next, req)(new JsonWebTokenError(''), undefined)
    })

    it('when verification is ok then next receive anything', () =>{
        usersQueryServiceMockConfig.findByEmail.mockResolvedValueOnce(userFactory.build() as UserInstance)
        const next = (ex?: any) => expect(ex).toBeUndefined()
        let req = { user: undefined } as AuthenticatedRequest
        verifyCallback(usersQueryServiceMockConfig, next, req)(null, 'sa')
    })

})