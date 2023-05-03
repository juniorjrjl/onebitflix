import { Course } from "../../../../src/models"
import CoursesQueryService from "../../../../src/services/queries/coursesQueryService"
import { courseFactory } from "../../../factories/course"
import { ModelNotFoundError } from "../../../../src/errors/modelNotFoundError"
import { faker } from "@faker-js/faker"
import { CourseInstance } from "../../../../src/models/Course"


describe('Courses Query Service', () => {

    let coursesQueryService: CoursesQueryService

    beforeEach(() => coursesQueryService = new CoursesQueryService())

    it('find by id test', async () => {
        const course = courseFactory.build()
        let mockStaticMethod = jest.fn();
        Course.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await course)
        const actual = await coursesQueryService.findById(course.id)
        expect(actual).toBe(course)
    })

    it('when try to get non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        Course.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValueOnce(undefined)
        try{
            await coursesQueryService.findById(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

    it('get random featured courses', async () => {
        const courses = Array.from(Array(10)).map((_, i) => courseFactory.build({id: i}))
        let mockStaticMethod = jest.fn();
        Course.findAll = mockStaticMethod
        mockStaticMethod.mockReturnValue(courses)
        const actual = await coursesQueryService.getRandomFeaturedCourses()
        const actualIds = actual.map(a => a.id)
        const expected = courses.filter(c => actualIds.includes(c.id))
        expect(expected.length).toBe(3)
        expect(actual).toStrictEqual(expected)
    })

    it('get top ten newest', async () =>{
        const courses = Array.from(Array(10)).map((_, i) => courseFactory.build({id: i}))
        let mockStaticMethod = jest.fn();
        Course.findAll = mockStaticMethod
        mockStaticMethod.mockReturnValue(courses)
        const actual = await coursesQueryService.getTopTenNewest()
        expect(actual).toStrictEqual(courses)
    })

    it.each([
        [(mock: jest.Mock<any, any, any>, returnedValue: any) => mock.mockReturnValueOnce(returnedValue)],
        [(mock: jest.Mock<any, any, any>, _: any) => mock.mockReturnValueOnce(null)],
    ])('get top ten by likes', async (mockConfigCallBack) =>{
        const courses = Array.from(Array(10)).map((_, i) => courseFactory.build({id: i}))
        let mockStaticMethod = jest.fn();
        Course.sequelize!.query = mockStaticMethod
        mockConfigCallBack(mockStaticMethod, [courses, 10])
        await coursesQueryService.getTopTenByLikes()
    })

    it('find by name test', async () => {
        const courses = courseFactory.buildList(10)
        let mockStaticMethod = jest.fn();
        Course.findAndCountAll = mockStaticMethod
        const count = (faker.random.numeric(3))
        mockStaticMethod.mockImplementation(async (a) => { 
            return { 
                rows: courses.map(c => c as CourseInstance),
                count 
            }
        })
        const page = Number(faker.random.numeric())
        const perPage = Number(faker.random.numeric())
        const actual = await coursesQueryService.findByName(page, perPage, faker.lorem.word())
        expect(actual.page).toEqual(page)
        expect(actual.perPage).toEqual(perPage)
        expect(actual.total).toBe(count)
        expect(actual.content).toStrictEqual(courses)
    })

    it('find by id with episodes test', async () => {
        const course = courseFactory.build()
        let mockStaticMethod = jest.fn();
        Course.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await course)
        const actual = await coursesQueryService.findByIdWithEpisodes(course.id)
        expect(actual).toBe(course)
    })

    it('when try to get with episodes non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        Course.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await coursesQueryService.findByIdWithEpisodes(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

})