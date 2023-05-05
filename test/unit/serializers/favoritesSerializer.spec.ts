import { Course } from "../../../src/models"
import { indexSerializer, saveSerializer } from "../../../src/serializers/favoritesSerializer"
import { courseFactory } from "../../factories/course"
import { favoriteFactory, favoriteWithCoursesFactory } from "../../factories/favorite"

describe('Favorites Serializers', () => {

    it('save serializer test', () =>{
        const favorite = favoriteFactory.build()
        const response = saveSerializer(favorite)
        expect(response.courseId).toBe(favorite.courseId)
        expect(response.userId).toBe(favorite.userId)
    })

    it('index serializer test', () =>{
        const courses = courseFactory.buildList(5)
        const favorite = favoriteWithCoursesFactory.build({courses})
        const actual = indexSerializer(favorite)
        expect(actual.userId).toBe(favorite.userId)
        actual.courses.forEach(a => {
            const expected = courses.find(c => c.id === a.id)
            expect(a.id).toBe(expected?.id)
            expect(a.name).toBe(expected?.name)
            expect(a.synopsis).toBe(expected?.synopsis)
            expect(a.thumbnailUrl).toBe(expected?.thumbnailUrl)
        })
    })

    it('when has no courses in index serializer then return empty', () =>{
        const courses: Course[] = []
        const favorite = favoriteWithCoursesFactory.build({courses})
        const actual = indexSerializer(favorite)
        expect(actual.userId).toBe(favorite.userId)
        expect(actual.courses).toStrictEqual(courses)
    })

})