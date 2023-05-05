import { StatusCodes } from "http-status-codes"
import { badRequestErrorSerializer, conflictErrorSerializer, defaultErrorSerializer, notFoundErrorSerializer, unauthorizedErrorSerializer } from "../../../src/serializers/errorsSerializer"
import { faker } from "@faker-js/faker"
import { InvalidParamField } from "../../../src/errors/invalidParamError"
import { isKey } from "../../utils/ObjectUtils"

describe('Error Serializers', () => {

    it.each([
        [notFoundErrorSerializer, StatusCodes.NOT_FOUND],
        [conflictErrorSerializer, StatusCodes.CONFLICT],
        [unauthorizedErrorSerializer, StatusCodes.UNAUTHORIZED],
    ])('basics serializers', (serializer, statusCode) =>{
        const message = faker.lorem.word()
        const errorResponse = serializer(message)
        expect(errorResponse.message).toBe(message)
        expect(errorResponse.status).toBe(statusCode)
        expect(errorResponse.timestamp).not.toBeNull()
    })

    it('default error serializer', () => {
        const errorResponse = defaultErrorSerializer()
        expect(errorResponse.message).not.toBeNull()
        expect(errorResponse.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(errorResponse.timestamp).not.toBeNull()
    })

    it.each([
        [null, (errorResponse: any) => expect(isKey(errorResponse, 'fields')).toBeFalsy()],
        [[InvalidParamField.builder().withField(faker.lorem.word()).withMessage(faker.lorem.word()).build(), InvalidParamField.builder().withField(faker.lorem.word()).withMessage(faker.lorem.word()).build()],
        (errorResponse: any) =>{
            expect(errorResponse.fields).toBeTruthy()
            expect(errorResponse.fields[0].field).toBeTruthy()
            expect(errorResponse.fields[0].message).toBeTruthy()
        } ],
        [[], (errorResponse: any) => expect(isKey(errorResponse, 'fields')).toBeFalsy()]
    ])('bad request serializer', (fields, fieldsExpect) => {
        const message = faker.lorem.word()
        const errorResponse = badRequestErrorSerializer(message, fields)
        expect(errorResponse.message).toBe(message)
        expect(errorResponse.status).toBe(StatusCodes.BAD_REQUEST)
        expect(errorResponse.timestamp).not.toBeNull()
        fieldsExpect(errorResponse)
    })

})