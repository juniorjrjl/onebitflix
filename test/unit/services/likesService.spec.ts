import { CourseAlreadyLikedError } from "../../../src/errors/courseAlreadyLikedError"
import { ModelNotFoundError } from "../../../src/errors/modelNotFoundError"
import { Like } from "../../../src/models"
import { CourseInstance } from "../../../src/models/Course"
import { UserInstance } from "../../../src/models/User"
import LikesService from "../../../src/services/likesService"
import CoursesQueryService from "../../../src/services/queries/coursesQueryService"
import LikesQueryService from "../../../src/services/queries/likesQueryService"
import UsersQueryService from "../../../src/services/queries/usersQueryService"
import { courseFactory } from "../../factories/course"
import { likeFactory } from "../../factories/like"
import { userFactory } from "../../factories/user"

jest.mock('../../../src/services/queries/usersQueryService')
jest.mock('../../../src/services/queries/coursesQueryService')
jest.mock('../../../src/services/queries/likesQueryService')

describe('Likes Service', () => {

    const UsersQueryServiceMock = UsersQueryService as jest.Mock<UsersQueryService>
    const CoursesQueryServiceMock = CoursesQueryService as jest.Mock<CoursesQueryService>
    const LikesQueryServiceMock = LikesQueryService as jest.Mock<LikesQueryService>
    let usersQueryServiceMocked: UsersQueryService
    let coursesQueryServiceMocked: CoursesQueryService
    let likesQueryServiceMocked: LikesQueryService
    let usersQueryServiceMockConfig: jest.Mocked<UsersQueryService>
    let coursesQueryServiceMockConfig: jest.Mocked<CoursesQueryService>
    let likesQueryServiceMockConfig: jest.Mocked<LikesQueryService>
    let likesService: LikesService

    beforeEach(() =>{
        UsersQueryServiceMock.mockClear()
        CoursesQueryServiceMock.mockClear()
        LikesQueryServiceMock.mockClear()
        usersQueryServiceMocked = new UsersQueryService() as jest.Mocked<UsersQueryService>;
        coursesQueryServiceMocked = new CoursesQueryService() as jest.Mocked<CoursesQueryService>
        likesQueryServiceMocked = new LikesQueryService() as jest.Mocked<LikesQueryService>
        usersQueryServiceMockConfig = (usersQueryServiceMocked as jest.Mocked<UsersQueryService>)
        coursesQueryServiceMockConfig = (coursesQueryServiceMocked as jest.Mocked<CoursesQueryService>)
        likesQueryServiceMockConfig = (likesQueryServiceMocked as jest.Mocked<LikesQueryService>)
        likesService = new LikesService(usersQueryServiceMocked, coursesQueryServiceMocked, likesQueryServiceMocked)
    })

    it('when try delete with user not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const like = likeFactory.build()
            await likesService.delete(like.userId, like.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(0)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(0)
    })

    it('when try delete with course not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const like = likeFactory.build()
            await likesService.delete(like.userId, like.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(0)
    })

    it("when try delete the course isn't in user's like list throw error", async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        likesQueryServiceMockConfig.isLiked.mockResolvedValueOnce(false)
        try{
            const like = likeFactory.build()
            await likesService.delete(like.userId, like.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(1)
    })

    it('delete like test', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        likesQueryServiceMockConfig.isLiked.mockResolvedValueOnce(true)
        jest.spyOn(Like, 'destroy').mockResolvedValueOnce(1)

        const like = likeFactory.build()
        await likesService.delete(like.userId, like.courseId)

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(1)
    })

    it('when try create with user not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const like = likeFactory.build()
            await likesService.create(like.userId, like.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(0)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(0)
    })

    it('when try create with course not stored then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            const like = likeFactory.build()
            await likesService.create(like.userId, like.courseId)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(0)
    })

    it('When try to like course Already liked then throw error', async () =>{
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        likesQueryServiceMockConfig.isLiked.mockResolvedValueOnce(true)

        try {
            const like = likeFactory.build()
            await likesService.create(like.userId, like.courseId)
        } catch (err) {
            expect(err).toBeInstanceOf(CourseAlreadyLikedError)
        }

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(1)
    })

    it('save like test', async () =>{
        const like = likeFactory.build()
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)
        coursesQueryServiceMockConfig.findById.mockResolvedValueOnce(courseFactory.build() as CourseInstance)
        likesQueryServiceMockConfig.isLiked.mockResolvedValueOnce(false)
        jest.spyOn(Like, 'create').mockResolvedValueOnce(like)

        await likesService.create(like.userId, like.courseId)

        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(coursesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(likesQueryServiceMocked.isLiked).toHaveBeenCalledTimes(1)
    })

})