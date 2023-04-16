import * as Factory from "factory.ts";
import { faker } from '@faker-js/faker'
import { WatchTime } from '../../src/models'
import { WatchTimeInstance } from "../../src/models/WatchTime";

export const watchTimeFactory = Factory.makeFactory<WatchTime>({
    userId: Number(faker.random.numeric()),
    episodeId: Number(faker.random.numeric()),
    seconds: Number(faker.random.numeric(4)),
    createdAt: new Date(),
    updatedAt: new Date()
});

export const setWatchTimePropsToInstance = (source: WatchTime, target: WatchTimeInstance) => {
    target.userId = source.userId
    target.episodeId = source.episodeId
    target.seconds = source.seconds
    target.createdAt = source.createdAt
    target.updatedAt = source.updatedAt
    return target
}