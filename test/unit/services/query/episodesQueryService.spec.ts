import EpisodesQueryService from "../../../../src/services/queries/episodesQueryService"
import { episodeFactory } from "../../../factories/episode"
import { Episode, WatchTime } from "../../../../src/models"
import { ModelNotFoundError } from "../../../../src/errors/modelNotFoundError"
import { watchTimeFactory } from "../../../factories/watchTime"

//jest.mock('fs')

describe('Episodes Query Service', () => {

    let episodesQueryService: EpisodesQueryService

    beforeEach(() => episodesQueryService = new EpisodesQueryService())


    /*it('get stream partial video', async ()=> {
        let mockFileInfo = jest.fn()
        jest.doMock('fs', () => {{statSync: mockFileInfo}})
        mockFileInfo.mockImplementation(a => {
            return { size: 100}
        })
        const videInfo = await episodesQueryService.streamEpisodeToResponse(faker.system.filePath(), 'bytes=0-')
        expect(videInfo.ContentLength).not.toBeNull()
        expect(videInfo.ContentRange).not.toBeNull()
        expect(videInfo.File).not.toBeNull()
    })*/

    it('get watchtime test', async () => {
        const watchTime = watchTimeFactory.build()
        let mockStaticMethod = jest.fn();
        WatchTime.findOne = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await watchTime)
        const actual = await episodesQueryService.getWatchTime(1, 1)
        expect(actual).toBe(watchTime)
    })

    it('when try to get watchtime non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        WatchTime.findOne = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await episodesQueryService.getWatchTime(1, 1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })


    it('find by userId and episodeId test', async () => {
        const watchTime = watchTimeFactory.build()
        let mockStaticMethod = jest.fn();
        WatchTime.findOne = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await watchTime)
        const actual = await episodesQueryService.findByUserIdAndEpisodeId(1, 1)
        expect(actual).toBe(watchTime)
    })

    it('when try to get with episodes non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        WatchTime.findOne = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await episodesQueryService.findByUserIdAndEpisodeId(1, 1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

    it('find by id test', async () => {
        const episode = episodeFactory.build()
        let mockStaticMethod = jest.fn();
        Episode.findByPk = mockStaticMethod
        mockStaticMethod.mockImplementation(async (a, b) => await episode)
        const actual = await episodesQueryService.findById(episode.id)
        expect(actual).toBe(episode)
    })

    it('when try to get with episodes non stored course then throw error', async () => {
        let mockStaticMethod = jest.fn();
        Episode.findByPk = mockStaticMethod
        mockStaticMethod.mockReturnValue(undefined)
        try{
            await episodesQueryService.findById(1)
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
    })

})