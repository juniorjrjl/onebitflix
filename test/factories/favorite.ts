import * as Factory from "factory.ts";
import { Favorite } from "../../src/models";
import { faker } from "@faker-js/faker";
import { courseFactory } from "./course";

export const favoriteFactory = Factory.makeFactory<Favorite>({
    userId: Number(faker.random.numeric()),
    courseId: Number(faker.random.numeric())
})

export const favoriteWithCourseFactory = Factory.makeFactory<any>({
    userId: Number(faker.random.numeric()),
    courseId: Number(faker.random.numeric()),
    course: courseFactory.build()
})

export const favoriteWithCoursesFactory = Factory.makeFactory<any>({
    userId: Number(faker.random.numeric()),
    courses: []
})