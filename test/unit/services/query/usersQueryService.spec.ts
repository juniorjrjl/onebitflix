import { faker } from "@faker-js/faker";
import { ModelNotFoundError } from "../../../../src/errors/modelNotFoundError";
import { User } from "../../../../src/models";
import UsersQueryService from "../../../../src/services/queries/usersQueryService";
import { userFactory, userWithKeepWatching } from "../../../factories/user";
import bcrypt from 'bcrypt'
import { UnauthorizedError } from "../../../../src/errors/unauthorizedError";

describe('Users Query Service', () => {

    let usersQueryService: UsersQueryService

    beforeEach(() => usersQueryService = new UsersQueryService())

    it('find by email test', async () => {
        const user = userFactory.build()
        let mockStaticMethod = jest.fn();
        User.findOne = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await user)
        const actual = await usersQueryService.findByEmail(user.email)
        expect(actual).toBe(user)
    })

    it('when try to get by email with non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        User.findOne = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await usersQueryService.findByEmail(faker.internet.email())
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

    it('find by id test', async () => {
        const user = userFactory.build()
        let mockStaticMethod = jest.fn();
        User.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await user)
        const actual = await usersQueryService.findById(user.id)
        expect(actual).toBe(user)
    })

    it('when try to get by id non stored user then throw error', async () => {
        let mockStaticMethod = jest.fn();
        User.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await usersQueryService.findById(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

    it('check password test', async () =>{
        const password = faker.lorem.word()
        const encodedPass = await bcrypt.hash(password, 10)
        const user = userFactory.build({ password: encodedPass })
        const actual = await usersQueryService.checkPassword(password, user)
        expect(actual).toBe(true)
    })

    it('when password is different then throw error', async () =>{
        const password = faker.lorem.word()
        const user = userFactory.build()
        try{
            await usersQueryService.checkPassword(password, user)
        }catch(err){
            expect(err).toBeInstanceOf(UnauthorizedError)
        }
    })

    it('get keep watching list test', async () => {
        const user = userWithKeepWatching.build()
        let mockStaticMethod = jest.fn();
        User.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await user)
        const actual = await usersQueryService.getKeepWatchingList(user.id)
        expect(actual).not.toBeNull()
    })

    it('when try to get with episodes non stored user then throw error', async () => {
        let mockStaticMethod = jest.fn();
        User.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await usersQueryService.getKeepWatchingList(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

})