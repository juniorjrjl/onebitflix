import { faker } from "@faker-js/faker"
import { Category } from "../../../../src/models"
import { CategoryInstance } from "../../../../src/models/Category"
import CategoriesQueryService from "../../../../src/services/queries/categoriesQueryService"
import { categoryFactory } from "../../../factories/category"
import { ModelNotFoundError } from "../../../../src/errors/modelNotFoundError"


describe('Categories Query Service', () => {

    let categoriesQueryService: CategoriesQueryService

    beforeEach(() => categoriesQueryService = new CategoriesQueryService())

    it('findAllPaginated test', async () => {
        const categories = categoryFactory.buildList(10)
        let mockStaticMethod = jest.fn();
        Category.findAndCountAll = mockStaticMethod
        const count = (faker.random.numeric(3))
        mockStaticMethod.mockImplementation(async (a) => { 
            return { 
                rows: categories.map(c => c as CategoryInstance),
                count 
            }
        })
        const page = Number(faker.random.numeric())
        const perPage = Number(faker.random.numeric())
        const actual = await categoriesQueryService.findAllPaginated(page, perPage)
        expect(actual.page).toEqual(page)
        expect(actual.perPage).toEqual(perPage)
        expect(actual.total).toBe(count)
        expect(actual.content).toStrictEqual(categories)
    })

    it('find by id test', async () => {
        const category = categoryFactory.build()
        let mockStaticMethod = jest.fn();
        Category.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await category)
        const actual = await categoriesQueryService.findByIdWithCourses(category.id)
        expect(actual).toBe(category)
    })

    it('when try to get non stored category then throw error', async () => {
        let mockStaticMethod = jest.fn();
        Category.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await categoriesQueryService.findByIdWithCourses(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

})