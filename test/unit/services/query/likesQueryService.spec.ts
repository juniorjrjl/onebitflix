import { Like } from "../../../../src/models"
import LikesQueryService from "../../../../src/services/queries/likesQueryService"
import { likeFactory } from "../../../factories/like"


describe('Likes Query Service', () => {

    let likesQueryService: LikesQueryService

    beforeEach(() => likesQueryService = new LikesQueryService())

    it.each([
        [null, false],
        [likeFactory.build(), true]
    ])('isLike', async (mockReturn, expected) =>{
        let mockStaticMethod = jest.fn();
        Like.findOne = mockStaticMethod
        mockStaticMethod.mockImplementation(a => mockReturn)
        const actual = await likesQueryService.isLiked(1, 1)
        expect(actual).toBe(expected)
    })

})