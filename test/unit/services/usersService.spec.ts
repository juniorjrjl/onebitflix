import { EmailInUseError } from "../../../src/errors/emailInUseError"
import { ModelNotFoundError } from "../../../src/errors/modelNotFoundError"
import { User } from "../../../src/models"
import { UserInstance } from "../../../src/models/User"
import UsersQueryService from "../../../src/services/queries/usersQueryService"
import UsersService from "../../../src/services/usersService"
import { userFactory } from "../../factories/user"

jest.mock('../../../src/services/queries/usersQueryService')

describe('Users Service', () => {

    const UsersQueryServiceMock = UsersQueryService as jest.Mock<UsersQueryService>
    let usersQueryServiceMocked: UsersQueryService
    let usersQueryServiceMockConfig: jest.Mocked<UsersQueryService>
    let usersService: UsersService

    beforeEach(() =>{
        UsersQueryServiceMock.mockClear()
        usersQueryServiceMocked = new UsersQueryService() as jest.Mocked<UsersQueryService>
        usersQueryServiceMockConfig = (usersQueryServiceMocked as jest.Mocked<UsersQueryService>)
        usersService = new UsersService(usersQueryServiceMocked)
    })

    it('create user test', async () => {
        const user = userFactory.build()
        usersQueryServiceMockConfig.findByEmail.mockRejectedValueOnce(new ModelNotFoundError(''))
        jest.spyOn(User, 'create').mockResolvedValueOnce(user)

        await usersService.create(user)

        expect(usersQueryServiceMockConfig.findByEmail).toHaveBeenCalledTimes(1)
    })

    it('when try create user with email used by another then throw error', async () => {
        const user = userFactory.build()
        usersQueryServiceMockConfig.findByEmail.mockResolvedValueOnce(user as UserInstance)

        try{
            await usersService.create(user)
        }catch(err){
            expect(err).toBeInstanceOf(EmailInUseError)
        }

        expect(usersQueryServiceMockConfig.findByEmail).toHaveBeenCalledTimes(1)
    })

    it.each([
        [(mock: jest.Mocked<UsersQueryService>, id: number) => mock.findByEmail.mockRejectedValueOnce(new ModelNotFoundError(''))],
        [(mock: jest.Mocked<UsersQueryService>, id: number) => mock.findByEmail.mockResolvedValueOnce(userFactory.build({id}) as UserInstance)]
    ])('update user test', async (mockConfigCallvack) => {
        const user = userFactory.build()
        mockConfigCallvack(usersQueryServiceMockConfig, user.id)

        let mockStaticMethod = jest.fn();
        User.update = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => [1, user as UserInstance])

        await usersService.update(user.id, user)

        expect(usersQueryServiceMockConfig.findByEmail).toHaveBeenCalledTimes(1)
    })

    it('when try tu use email in use then throw a error', async () =>{
        const user = userFactory.build({id: 1})
        usersQueryServiceMockConfig.findByEmail.mockResolvedValueOnce(userFactory.build({id: 2, email: user.email}) as UserInstance)
        try{
            await usersService.update(user.id, user)
        }catch(err){
            expect(err).toBeInstanceOf(EmailInUseError)
        }
        expect(usersQueryServiceMockConfig.findByEmail).toHaveBeenCalledTimes(1)
    })

})