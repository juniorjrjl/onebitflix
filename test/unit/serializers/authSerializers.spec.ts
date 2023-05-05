import { faker } from "@faker-js/faker"
import { loginSerializer, registerSerializer } from "../../../src/serializers/authSerializer"
import { userFactory } from "../../factories/user"
import { isKey } from "../../utils/ObjectUtils"

describe('Auth Serializers', () => {

    it('register serializer test', () =>{
        const user = userFactory.build()
        const actual = registerSerializer(user)
        Object.keys(actual).forEach(p => {
            if ((isKey(actual, p)) && (isKey(user, p))){
                expect(actual[p]).toBe(user[p])
            }
        })
    })

    it('login serializer test', () =>{
        const actual = loginSerializer(faker.lorem.word())
        Object.keys(actual).forEach(p =>{
            if (isKey(actual, p)){
                expect(actual[p]).not.toBeNull()
            }
        })
    })

})