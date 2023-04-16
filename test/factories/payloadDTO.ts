import * as Factory from "factory.ts";
import { faker } from "@faker-js/faker";
import { PayloadDTO } from "../../src/dto/payloadDTO";

export const payloadDTOFactory = Factory.makeFactory<PayloadDTO>({
    id: Number(faker.random.numeric()),
    firstName: faker.name.firstName(),
    email: faker.internet.email()
})