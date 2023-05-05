import { getWatchTimeSerializer, setWatchTimeSerializer } from "../../../src/serializers/episodesSerializer"
import { watchTimeFactory } from "../../factories/watchTime"
import { isKey } from "../../utils/ObjectUtils"

describe('Episodes Serializers', () => {

    it('get watchTime serializer test', () =>{
        const watchTime = watchTimeFactory.build()
        const actual = getWatchTimeSerializer(watchTime)
        Object.keys(actual).forEach(p => {
            if ((isKey(actual, p)) && (isKey(watchTime, p))){
                expect(actual[p]).toBe(watchTime[p])
            }
        })
    })

    it('get watchTime serializer test', () =>{
        const watchTime = watchTimeFactory.build()
        const actual = setWatchTimeSerializer(watchTime)
        Object.keys(actual).forEach(p => {
            if ((isKey(actual, p)) && (isKey(watchTime, p))){
                expect(actual[p]).toBe(watchTime[p])
            }
        })
    })

})