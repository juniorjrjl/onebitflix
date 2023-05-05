import { showSerializer, updateSerializer, watchingSerializer } from "../../../src/serializers/usersSerializer"
import { courseFactory } from "../../factories/course"
import { episodeFactory } from "../../factories/episode"
import { userFactory } from "../../factories/user"
import { watchTimeFactory } from "../../factories/watchTime"
import { isKey } from "../../utils/ObjectUtils"

describe('Users Serializers', () => {

    it('update serializer test', () => {
        const user = userFactory.build()
        const actual = updateSerializer(user)
        Object.keys(actual).forEach(p => {
            if ((isKey(actual, p)) && (isKey(user, p))){
                expect(actual[p]).toBe(user[p])
            }
        })
    })

    it('show serializer test', () => {
        const user = userFactory.build()
        const actual = showSerializer(user)
        Object.keys(actual).forEach(p => {
            if ((isKey(actual, p)) && (isKey(user, p))){
                expect(actual[p]).toBe(user[p])
            }
        })
    })

    it('when has no watchTime then return empty list', () => {
        const actual = watchingSerializer([])
        expect(actual).toStrictEqual([])
    })

    it('when has no nested properties then return it null object', () =>{
        const episodes = episodeFactory.buildList(5)
        const actual = watchingSerializer(episodes)
        actual.forEach(a =>{
            const expected = episodes.find(e => e.id === a.id)
            if (!(expected)) throw new Error('Era esperado um correspondente')

            expect(a.id).toBe(expected.id)
            expect(a.name).toBe(expected.name)
            expect(a.synopsis).toBe(expected.synopsis)
            expect(a.order).toBe(expected.order)
            expect(a.videoUrl).toBe(expected.videoUrl)
            expect(a.secondsLong).toBe(expected.secondsLong)
            expect(a.course).toBeFalsy()
            expect(a.watchTime).toBeFalsy()
        })
    })

    it('watching serializer test', () =>{
        const episodes = episodeFactory.buildList(5, {Course: courseFactory.build(), WatchTime: watchTimeFactory.build()})
        const actual = watchingSerializer(episodes)
        actual.forEach(a =>{
            const expected = episodes.find(e => e.id === a.id)
            if (!(expected)) throw new Error('Era esperado um correspondente')

            expect(a.id).toBe(expected.id)
            expect(a.name).toBe(expected.name)
            expect(a.synopsis).toBe(expected.synopsis)
            expect(a.order).toBe(expected.order)
            expect(a.videoUrl).toBe(expected.videoUrl)
            expect(a.secondsLong).toBe(expected.secondsLong)
            const actualCourse = a.course!
            const actualWatchTime = a.watchTime!

            Object.keys(actualCourse).forEach(p => {
                if ((isKey(actualCourse, p)) && (isKey(a.course!, p))){
                    expect(actualCourse[p]).toBe(a.course![p])
                }
            })

            Object.keys(actualWatchTime).forEach(p => {
                if ((isKey(actualWatchTime, p)) && (isKey(a.watchTime!, p))){
                    expect(actualWatchTime[p]).toBe(a.watchTime![p])
                }
            })

        })
    })

})