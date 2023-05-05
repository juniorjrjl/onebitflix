import { faker } from "@faker-js/faker"
import { Course, Episode } from "../../../src/models"
import { featuredSerializer, newestSerializer, popularSerializer, searchSerializer, showSerializer } from "../../../src/serializers/coursesSerializer"
import { courseFactory } from "../../factories/course"
import { isKey } from "../../utils/ObjectUtils"
import { episodeFactory } from "../../factories/episode"

describe('Categories Serializers', () => {

    it('featured serializer test', () =>{
        const courses = courseFactory.buildList(5)
        const actual = featuredSerializer(courses)
        actual.forEach(c =>{
            const expected = courses.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado achar o curso vinculado')

            Object.keys(c).forEach(p => {
                if ((isKey(c, p)) && (isKey(expected, p))){
                    expect(c[p]).toStrictEqual(expected[p])
                }
            })
        })
    })

    it('when featured serializer receive empty list then return empty', () =>{
        const courses: Course[] = []
        const actual = featuredSerializer(courses)
        expect(actual).toStrictEqual(courses)
    })

    it('newest serializer test', () =>{
        const courses = courseFactory.buildList(5)
        const actual = newestSerializer(courses)
        actual.forEach(c =>{
            const expected = courses.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado achar o curso vinculado')

            Object.keys(c).forEach(p => {
                if ((isKey(c, p)) && (isKey(expected, p))){
                    expect(c[p]).toStrictEqual(expected[p])
                }
            })
        })
    })

    it('when newest serializer receive empty list then return empty', () =>{
        const courses: Course[] = []
        const actual = newestSerializer(courses)
        expect(actual).toStrictEqual(courses)
    })

    it('show serializer test', () =>{
        const episodes = episodeFactory.buildList(5)
        const course = courseFactory.build({Episodes: episodes})
        const liked = Number(faker.random.numeric()) % 2 === 0
        const favorited = Number(faker.random.numeric()) % 2 === 0
        const actual = showSerializer(course, liked, favorited)
        expect(actual.id).toBe(course.id)
        expect(actual.name).toBe(course.name)
        expect(actual.synopsis).toBe(course.synopsis)
        expect(actual.thumbnailUrl).toBe(course.thumbnailUrl)
        expect(actual.liked).toBe(liked)
        expect(actual.favorited).toBe(favorited)
        actual.episodes.forEach(e =>{
            const expected = episodes.find(ex => ex.id === e.id)
            if (!(expected)) throw new Error('Era esperado achar o curso vinculado')

            expect(e.id).toBe(expected.id)
            expect(e.name).toBe(expected.name)
            expect(e.synopsis).toBe(expected.synopsis)
            expect(e.order).toBe(expected.order)
            expect(e.videoUrl).toBe(expected.videoUrl)
            expect(e.secondsLong).toBe(expected.secondsLong)
        })
    })

    it('show serializer test', () =>{
        const episodes: Episode[] = []
        const course = courseFactory.build({Episodes: episodes})
        const liked = Number(faker.random.numeric()) % 2 === 0
        const favorited = Number(faker.random.numeric()) % 2 === 0
        const actual = showSerializer(course, liked, favorited)
        expect(actual.id).toBe(course.id)
        expect(actual.name).toBe(course.name)
        expect(actual.synopsis).toBe(course.synopsis)
        expect(actual.thumbnailUrl).toBe(course.thumbnailUrl)
        expect(actual.liked).toBe(liked)
        expect(actual.favorited).toBe(favorited)
        expect(actual.episodes).toStrictEqual(episodes)
    })

    it('index serializer', () =>{
        const courses = courseFactory.buildList(5)
        const page = Number(faker.random.numeric(2))
        const perPage = Number(faker.random.numeric(2))
        const total = Number(faker.random.numeric(2))
        const actual = searchSerializer({ page, perPage, total, content: courses })
        expect(actual.page).toBe(page)
        expect(actual.perPage).toBe(perPage)
        expect(actual.total).toBe(total)
        actual.content.forEach(c =>{
            var expected = actual.content.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado um correspondente')
            
                expect(c.id).toBe(expected.id)
                expect(c.name).toBe(expected.name)
                expect(c.synopsis).toBe(expected.synopsis)
                expect(c.order).toBe(expected.order)
                expect(c.videoUrl).toBe(expected.videoUrl)
                expect(c.secondsLong).toBe(expected.secondsLong)
        })
    })

    it('when has no course in index serializer then return empty list', () => {
        const categories: Course[] = []
        const page = Number(faker.random.numeric(2))
        const perPage = Number(faker.random.numeric(2))
        const total = Number(faker.random.numeric(2))
        const actual = searchSerializer({ page, perPage, total, content: categories })
        expect(actual.page).toBe(page)
        expect(actual.perPage).toBe(perPage)
        expect(actual.total).toBe(total)
        expect(actual.content).toStrictEqual(categories)
    })


    it('popular serializer test', () =>{
        const courses = courseFactory.buildList(5)
        const actual = popularSerializer(courses)
        actual.forEach(c =>{
            const expected = courses.find(e => e.id === c.id)
            if (!(expected)) throw new Error('Era esperado achar o curso vinculado')

            Object.keys(c).forEach(p => {
                if ((isKey(c, p)) && (isKey(expected, p))){
                    expect(c[p]).toStrictEqual(expected[p])
                }
            })
        })
    })

    it('when popular serializer receive empty list then return empty', () =>{
        const courses: Course[] = []
        const actual = popularSerializer(courses)
        expect(actual).toStrictEqual(courses)
    })

})