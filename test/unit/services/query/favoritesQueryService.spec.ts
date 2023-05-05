import { Favorite } from "../../../../src/models"
import FavoritesQueryService from "../../../../src/services/queries/favoritesQueryService"
import { favoriteFactory, favoriteWithCourseFactory } from "../../../factories/favorite"


describe('Favorites Query Service', () => {

    let favoritesQueryService: FavoritesQueryService

    beforeEach(() => favoritesQueryService = new FavoritesQueryService())

    it('find user favorites', async () =>{
        const userId = 1
        const favorites = favoriteWithCourseFactory.buildList(5)
        let mockStaticMethod = jest.fn();
        Favorite.findAll = mockStaticMethod
        mockStaticMethod.mockImplementation(async a => favorites)
        const actual = await favoritesQueryService.findByUserId(userId)
        expect(actual).toHaveProperty('userId')
        expect(actual).toHaveProperty('courses')
        expect(Object.keys(actual).length).toBe(2)
    })

    it.each([
        [null, false],
        [favoriteFactory.build(), true]
    ])('isFavorite', async (mockReturn, expected) =>{
        let mockStaticMethod = jest.fn();
        Favorite.findOne = mockStaticMethod
        mockStaticMethod.mockImplementation(a => mockReturn)
        const actual = await favoritesQueryService.isFavorited(1, 1)
        expect(actual).toBe(expected)
    })

})