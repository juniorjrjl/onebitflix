import * as Factory from "factory.ts";
import { Category } from "../../src/models";
import { faker } from "@faker-js/faker";

export const categoryFactory = Factory.makeFactory<Category>({
    id: Number(faker.random.numeric()),
    name: faker.lorem.word(),
    position: Number(faker.random.numeric()),
    Courses: undefined
})