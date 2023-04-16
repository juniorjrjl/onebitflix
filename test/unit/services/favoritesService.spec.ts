import { CourseAlreadyFavoritedError } from "../../../src/errors/courseAlreadyFavoritedError"
import { ModelNotFoundError } from "../../../src/errors/modelNotFoundError"
import { Favorite } from "../../../src/models"
import { CourseInstance } from "../../../src/models/Course"
import { UserInstance } from "../../../src/models/User"
import FavoritesService from "../../../src/services/favoritesService"
import CoursesQueryService from "../../../src/services/queries/coursesQueryService"
import FavoritesQueryService from "../../../src/services/queries/favoritesQueryService"
import UsersQueryService from "../../../src/services/queries/usersQueryService"
import { courseFactory } from "../../factories/course"
import { favoriteFactory } from "../../factories/favorite"
import { userFactory } from "../../factories/user"

jest.mock('../../../src/services/queries/usersQueryService')
jest.mock('../../../src/services/queries/coursesQueryService')
jest.mock('../../../src/services/queries/favoritesQueryService')

describe('Episodes Service', () => {

    const UsersQueryServiceMock = UsersQueryService as jest.Mock<UsersQueryService>
    const CoursesQueryServiceMock = CoursesQueryService as jest.Mock<CoursesQueryService>
    const FavoritesQueryServiceMock = FavoritesQueryService as jest.Mock<FavoritesQueryService>
    let usersQueryServiceMocked: UsersQueryService
    let coursesQueryServiceMocked: CoursesQueryService
    let favoritesQueryServiceMocked: FavoritesQueryService
    let usersQueryServiceMockConfig: jest.Mocked<UsersQueryService>
    let coursesQueryServiceMockConfig: jest.Mocked<CoursesQueryService>
    let favoritesQueryServiceMockConfig: jest.Mocked<FavoritesQueryService>
    let favoritesService: FavoritesService

    beforeEach(() =>{
        UsersQueryServiceMock.mockClear()
        CoursesQueryServiceMock.mockClear()
        FavoritesQueryServiceMock.mockClear()
        usersQueryServiceMocked = new UsersQueryService() as jest.Mocked<UsersQueryService>;
        coursesQueryServiceMocked = new CoursesQueryService() as jest.Mocked<CoursesQueryService>
        favoritesQueryServiceMocked = new FavoritesQueryService() as jest.Mocked<FavoritesQueryService>
        usersQueryServiceMockConfig = (usersQueryServiceMocked as jest.Mocked<UsersQueryService>)
        coursesQueryServiceMockConfig = (coursesQueryServiceMocked as jest.Mocked<CoursesQueryService>)
        favoritesQueryServiceMockConfig = (favoritesQueryServiceMocked as jest.Mocked<FavoritesQueryService>)
        favoritesService = new FavoritesService(usersQueryServiceMocked, coursesQueryServiceMocked, favoritesQueryServiceMocked)
    })

    it('when try delete with user not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const favorite = favoriteFactory.build()
            await favoritesService.delete(favorite.userId, favorite.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(0)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(0)
    })

    it('when try delete with course not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const favorite = favoriteFactory.build()
            await favoritesService.delete(favorite.userId, favorite.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(0)
    })

    it("when try delete the course isn't in user's favorite list throw error", async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        favoritesQueryServiceMockConfig.isFavorited.mockResolvedValueOnce(false)
        try{
            const favorite = favoriteFactory.build()
            await favoritesService.delete(favorite.userId, favorite.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(1)
    })

    it('delete favorite test', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        favoritesQueryServiceMockConfig.isFavorited.mockResolvedValueOnce(true)
        jest.spyOn(Favorite, 'destroy').mockResolvedValueOnce(1)

        const favorite = favoriteFactory.build()
        await favoritesService.delete(favorite.userId, favorite.courseId)

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(1)
    })

    it('when try create with user not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const favorite = favoriteFactory.build()
            await favoritesService.create(favorite.userId, favorite.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(0)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(0)
    })

    it('when try create with course not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const favorite = favoriteFactory.build()
            await favoritesService.create(favorite.userId, favorite.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(0)
    })

    it('When try to favorite course Already favorited then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        favoritesQueryServiceMockConfig.isFavorited.mockResolvedValueOnce(true)

        try {
            const favorite = favoriteFactory.build()
            await favoritesService.create(favorite.userId, favorite.courseId)
        } catch (err) {
            expect(err).toBeInstanceOf(CourseAlreadyFavoritedError)
        }

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(1)
    })

    it('save favorite test', async () =>{
        const favorite = favoriteFactory.build()
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        favoritesQueryServiceMockConfig.isFavorited.mockResolvedValueOnce(false)
        jest.spyOn(Favorite, 'create').mockResolvedValueOnce(favorite)

        await favoritesService.create(favorite.userId, favorite.courseId)

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(favoritesQueryServiceMocked.isFavorited).toHaveBeenCalledTimes(1)
    })

})