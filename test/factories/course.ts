import * as Factory from "factory.ts";
import { Course } from "../../src/models";
import { faker } from "@faker-js/faker";

export const courseFactory = Factory.makeFactory<Course>({
    id: Number(faker.random.numeric()),
    name: faker.lorem.word(),
    synopsis: faker.lorem.words(5),
    thumbnailUrl: faker.internet.url(),
    featured: (Number(faker.random.numeric()) % 2 === 0),
    categoryId: Number(faker.random.numeric()),
    createdAt: new Date(),
    updatedAt: new Date()
})