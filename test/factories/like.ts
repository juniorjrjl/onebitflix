import * as Factory from "factory.ts";
import { Like } from "../../src/models";
import { faker } from "@faker-js/faker";

export const likeFactory = Factory.makeFactory<Like>({
    userId: Number(faker.random.numeric()),
    courseId: Number(faker.random.numeric())
})