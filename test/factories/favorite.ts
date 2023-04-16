import * as Factory from "factory.ts";
import { Favorite } from "../../src/models";
import { faker } from "@faker-js/faker";

export const favoriteFactory = Factory.makeFactory<Favorite>({
    userId: Number(faker.random.numeric()),
    courseId: Number(faker.random.numeric())
})