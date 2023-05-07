import * as Factory from "factory.ts";
import { faker } from '@faker-js/faker'
import { WatchTime } from '../../src/models'

export const watchTimeFactory = Factory.makeFactory<WatchTime>({
    userId: Number(faker.random.numeric()),
    episodeId: Number(faker.random.numeric()),
    seconds: Number(faker.random.numeric(4)),
    createdAt: new Date(),
    updatedAt: new Date()
});
