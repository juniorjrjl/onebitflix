import EpisodesService from "../../../src/services/episodesService"
import EpisodesQueryService from "../../../src/services/queries/episodesQueryService"
import { setWatchTimePropsToInstance, watchTimeFactory } from "../../factories/watchTime"
import { WatchTime } from "../../../src/models"
import { WatchTimeInstance } from "../../../src/models/WatchTime"
import { MockProxy, mock } from "jest-mock-extended"
import UsersQueryService from "../../../src/services/queries/usersQueryService"
import { episodeFactory } from "../../factories/episode"
import { userFactory } from "../../factories/user"
import { EpisodeInstance } from "../../../src/models/Episode"
import { UserInstance } from "../../../src/models/User"
import { ModelNotFoundError } from "../../../src/errors/modelNotFoundError"

jest.mock('../../../src/services/queries/usersQueryService')
jest.mock('../../../src/services/queries/episodesQueryService')
jest.mock('../../../src/models/')
jest.mock('../../../src/models/WatchTime')

describe('Episodes Service', () => {

    const EpisodesQueryServiceMock = EpisodesQueryService as jest.Mock<EpisodesQueryService>
    const UsersQueryServiceMock = UsersQueryService as jest.Mock<UsersQueryService>
    let episodesQueryServiceMocked: EpisodesQueryService
    let usersQueryServiceMocked: UsersQueryService
    let episodesService: EpisodesService
    let watchTimeInstanceMock: MockProxy<WatchTimeInstance>
    let episodesQueryServiceMockConfig: jest.Mocked<EpisodesQueryService>
    let usersQueryServiceMockConfig: jest.Mocked<UsersQueryService>

    beforeEach(() =>{
        watchTimeInstanceMock = mock()
        EpisodesQueryServiceMock.mockClear();
        UsersQueryServiceMock.mockClear()
        episodesQueryServiceMocked = new EpisodesQueryService() as jest.Mocked<EpisodesQueryService>;
        usersQueryServiceMocked = new UsersQueryService() as jest.Mocked<UsersQueryService>;
        episodesQueryServiceMockConfig = (episodesQueryServiceMocked as jest.Mocked<EpisodesQueryService>)
        usersQueryServiceMockConfig = (usersQueryServiceMocked as jest.Mocked<UsersQueryService>)
        episodesService = new EpisodesService(episodesQueryServiceMocked, usersQueryServiceMocked)
    })

    it('When has watchTime then update it', async ()=> {
        const watchTime =  watchTimeFactory.build();
        episodesQueryServiceMockConfig.findByUserIdAndEpisodeId.mockResolvedValueOnce(watchTimeInstanceMock)
        episodesQueryServiceMockConfig.findById.mockResolvedValueOnce(episodeFactory.build() as EpisodeInstance)
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)

        watchTimeInstanceMock.save.mockResolvedValueOnce(watchTime as WatchTimeInstance)
        await episodesService.setWatchTime(setWatchTimePropsToInstance(watchTime, watchTimeInstanceMock))
        expect(episodesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(1)
        expect(watchTimeInstanceMock.save).toHaveBeenCalledTimes(1)
    })

    it('When has no watchTime then save it', async ()=> {
        const watchTime =  watchTimeFactory.build();
        episodesQueryServiceMockConfig.findByUserIdAndEpisodeId.mockResolvedValueOnce(null)
        episodesQueryServiceMockConfig.findById.mockResolvedValueOnce(episodeFactory.build() as EpisodeInstance)
        usersQueryServiceMockConfig.findById.mockResolvedValueOnce(userFactory.build() as UserInstance)

        await episodesService.setWatchTime(setWatchTimePropsToInstance(watchTime, watchTimeInstanceMock))
        expect(episodesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        jest.spyOn(WatchTime, 'create').mockResolvedValueOnce(watchTime)
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(1)
        expect(WatchTime.create).toHaveBeenCalledTimes(1)
    })

    it('when episode not stored then throw error', async () =>{
        const watchTime =  watchTimeFactory.build();
        episodesQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            await episodesService.setWatchTime(setWatchTimePropsToInstance(watchTime, watchTimeInstanceMock))
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(episodesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(0)
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(0)
        expect(watchTimeInstanceMock.save).toHaveBeenCalledTimes(0)
    })

    it('when user not stored then throw error', async () =>{
        const watchTime =  watchTimeFactory.build();
        episodesQueryServiceMockConfig.findById.mockResolvedValueOnce(episodeFactory.build() as EpisodeInstance)
        usersQueryServiceMockConfig.findById.mockRejectedValueOnce(new ModelNotFoundError('error'))
        try{
            await episodesService.setWatchTime(setWatchTimePropsToInstance(watchTime, watchTimeInstanceMock))
        }catch(err){
            expect(err).toBeInstanceOf(ModelNotFoundError)
        }
        expect(episodesQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(usersQueryServiceMocked.findById).toHaveBeenCalledTimes(1)
        expect(episodesQueryServiceMocked.findByUserIdAndEpisodeId).toHaveBeenCalledTimes(0)
        expect(watchTimeInstanceMock.save).toHaveBeenCalledTimes(0)
    })

})