import * as Factory from "factory.ts";
import { User } from "../../src/models";
import { faker } from "@faker-js/faker";

export const userFactory = Factory.makeFactory<User>({
    id: Number(faker.random.numeric()),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number(),
    birth: faker.date.birthdate(),
    email: faker.internet.email(),
    password: '123456',
    role: (Number(faker.random.numeric()) % 2 === 0 ? 'admin' : 'user')
})