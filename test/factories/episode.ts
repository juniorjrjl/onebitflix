import * as Factory from "factory.ts";
import { Episode } from "../../src/models";
import { faker } from "@faker-js/faker";

export const episodeFactory =  Factory.makeFactory<Episode>({
    id: Number(faker.random.numeric()),
    name: faker.lorem.word(),
    synopsis: faker.lorem.words(5),
    order: Number(faker.random.numeric()),
    videoUrl: faker.internet.url(),
    secondsLong: Number(faker.random.numeric(4)),
    courseId: Number(faker.random.numeric())
})