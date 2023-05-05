import { saveSerializer } from "../../../src/serializers/likesSerializer"
import { likeFactory } from "../../factories/like"

describe('Likes Serializers', () => {

    it('save serializer test', () =>{
        const like = likeFactory.build()
        const response = saveSerializer(like)
        expect(response.courseId).toBe(like.courseId)
        expect(response.userId).toBe(like.userId)
    })
})