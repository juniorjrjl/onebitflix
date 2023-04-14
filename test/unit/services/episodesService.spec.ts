import EpisodesService from "../../../src/services/episodesService"
import EpisodesQueryService from "../../../src/services/queries/episodesQueryService"
import { setPropsToInsetance, watchTimeFactory } from "../../factories/watchTime"
import { WatchTime } from "../../../src/models"
import { WatchTimeInstance } from "../../../src/models/WatchTime"
import { MockProxy, mock } from "jest-mock-extended"

jest.mock('../../../src/services/queries/episodesQueryService')
jest.mock('../../../src/models/')
jest.mock('../../../src/models/WatchTime')

describe('Episodes Service', () => {

    const EpisodesQueryServiceMock = EpisodesQueryService as jest.Mock<EpisodesQueryService>
    let episodesQueryServiceMocked: EpisodesQueryService
    let episodesService: EpisodesService
    let watchTimeInstanceMock: MockProxy<WatchTimeInstance>

    beforeEach(() =>{
        watchTimeInstanceMock = mock()
        EpisodesQueryServiceMock.mockClear();
        episodesQueryServiceMocked = new EpisodesQueryService() as jest.Mocked<EpisodesQueryService>;
        episodesService = new EpisodesService(episodesQueryServiceMocked)
    })

    it('When has watchTime then update it', async ()=> {
        const watchTime =  watchTimeFactory.build();
        (episodesQueryServiceMocked as jest.Mocked<EpisodesQueryService>).findByUserIdAndEpisodeId.mockResolvedValueOnce(watchTimeInstanceMock)
        watchTimeInstanceMock.save.mockResolvedValueOnce(watchTime as WatchTimeInstance)
        await episodesService.setWatchTime(setPropsToInsetance(watchTime, watchTimeInstanceMock))
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(1)
        expect(watchTimeInstanceMock.save).toHaveBeenCalledTimes(1)
    })

    it('When has no watchTime then save it', async ()=> {
        const watchTime =  watchTimeFactory.build();
        (episodesQueryServiceMocked as jest.Mocked<EpisodesQueryService>).findByUserIdAndEpisodeId.mockResolvedValueOnce(null)
        await episodesService.setWatchTime(setPropsToInsetance(watchTime, watchTimeInstanceMock))
        jest.spyOn(WatchTime, 'create').mockRejectedValueOnce(watchTime)
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(1)
        expect(WatchTime.create).toHaveBeenCalledTimes(1)
    })

})