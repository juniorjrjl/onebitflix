import { faker } from "@faker-js/faker"
import { indexSerializer, showSerializer } from "../../../src/serializers/categoriesSerializer"
import { categoryFactory } from "../../factories/category"
import { courseFactory } from "../../factories/course"
import { Category } from "../../../src/models"

describe('Categories Serializers', () => {

    it('show serializer', () =>{
        const courses = courseFactory.buildList(5)
        const category = categoryFactory.build({Courses: courses})
        const actual = showSerializer(category)
        expect(actual.id).toBe(category.id)
        expect(actual.name).toBe(category.name)
        actual.courses.forEach(c =>{
            const expected = courses.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado um correspondente')

            expect(c.id).toBe(expected.id)
            expect(c.name).toBe(expected.name)
            expect(c.synopsis).toBe(expected.synopsis)
            expect(c.thumbnailUrl).toBe(expected.thumbnailUrl)
        })
    })

    it.each([
        [undefined],
        [[]]
    ])
    ('when has no course in show serializer then return empty list', (courses) =>{
        const category = categoryFactory.build({Courses: courses})
        const actual = showSerializer(category)
        expect(actual.id).toBe(category.id)
        expect(actual.name).toBe(category.name)
        expect(actual.courses).toStrictEqual([])
    })

    it('index serializer', () =>{
        const categories = categoryFactory.buildList(5)
        const page = Number(faker.random.numeric(2))
        const perPage = Number(faker.random.numeric(2))
        const total = Number(faker.random.numeric(2))
        const actual = indexSerializer({ page, perPage, total, content: categories })
        expect(actual.page).toBe(page)
        expect(actual.perPage).toBe(perPage)
        expect(actual.total).toBe(total)
        actual.content.forEach(c =>{
            var expected = actual.content.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado um correspondente')
            
                expect(c.id).toBe(expected.id)
                expect(c.name).toBe(expected.name)
                expect(c.position).toBe(expected.position)
        })
    })

    it('when has no course in index serializer then return empty list', () => {
        const categories: Category[] = []
        const page = Number(faker.random.numeric(2))
        const perPage = Number(faker.random.numeric(2))
        const total = Number(faker.random.numeric(2))
        const actual = indexSerializer({ page, perPage, total, content: categories })
        expect(actual.page).toBe(page)
        expect(actual.perPage).toBe(perPage)
        expect(actual.total).toBe(total)
        expect(actual.content).toStrictEqual(categories)
    })

})