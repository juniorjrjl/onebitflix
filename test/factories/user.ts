import * as Factory from "factory.ts";
import { User } from "../../src/models";
import { faker } from "@faker-js/faker";
import bcrypt from 'bcrypt'

export const userFactory = Factory.makeFactory<User>({
    id: Number(faker.random.numeric()),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number(),
    birth: faker.date.birthdate(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('123456', 10),
    role: (Number(faker.random.numeric()) % 2 === 0 ? 'admin' : 'user')
})


const courseFactory = Factory.makeFactory<any>({
    id: Number(faker.random.numeric()),
    name: faker.lorem.word(),
    synopsis: faker.lorem.words(5),
    thumbnailUrl: faker.internet.url(),
    featured: (Number(faker.random.numeric()) % 2 === 0),
    categoryId: Number(faker.random.numeric()),
})

const watchTimeFactory = Factory.makeFactory<any>({
    userId: Number(faker.random.numeric()),
    episodeId: Number(faker.random.numeric()),
    seconds: Number(faker.random.numeric(4)),
    createdAt: new Date(),
    updatedAt: new Date()
});

const episodeFactory =  Factory.makeFactory<any>({
    id: Number(faker.random.numeric()),
    name: faker.lorem.word(),
    synopsis: faker.lorem.words(5),
    order: Number(faker.random.numeric()),
    videoUrl: faker.internet.url(),
    secondsLong: Number(faker.random.numeric(4)),
    courseId: Number(faker.random.numeric()),
    watchTime: watchTimeFactory.build(),
    Course: courseFactory.build()
})

export const userWithKeepWatching = Factory.makeFactory<any>({
    id: Number(faker.random.numeric()),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number(),
    birth: faker.date.birthdate(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('123456', 10),
    role: (Number(faker.random.numeric()) % 2 === 0 ? 'admin' : 'user'),
    Episodes: episodeFactory.buildList(5)
})