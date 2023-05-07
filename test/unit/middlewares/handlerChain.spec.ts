import { Response } from "express"
import { handleChain } from "../../../src/middlewares/errorChain/handlerChain"
import { MockProxy, mock } from "jest-mock-extended"
import { StatusCodes } from "http-status-codes"
import { UnauthorizedError } from "../../../src/errors/unauthorizedError"
import { EmailInUseError } from "../../../src/errors/emailInUseError"
import { ModelNotFoundError } from "../../../src/errors/modelNotFoundError"
import { CourseAlreadyFavoritedError } from "../../../src/errors/courseAlreadyFavoritedError"
import { CourseAlreadyLikedError } from "../../../src/errors/courseAlreadyLikedError"
import { InvalidParamError, InvalidParamField } from "../../../src/errors/invalidParamError"
import { faker } from "@faker-js/faker"
import { OneBitFlixError } from "../../../src/errors/oneBitFlixError"

describe('handle chain test', () =>{

    it.each([
        [
            new Error(), 
            (status: number) => expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.INTERNAL_SERVER_ERROR)
            }
        ],
        [
            new OneBitFlixError(''), 
            (status: number) => expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.INTERNAL_SERVER_ERROR)
            }
        ],
        [
            new UnauthorizedError(''),
            (status: number) => expect(status).toBe(StatusCodes.UNAUTHORIZED), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.UNAUTHORIZED)
            }
        ],
        [
            new EmailInUseError(''),
            (status: number) => expect(status).toBe(StatusCodes.CONFLICT), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.CONFLICT)
            }
        ],
        [
            new InvalidParamError('', [InvalidParamField.builder().withField(faker.lorem.word()). withMessage(faker.lorem.word()).build()]),
            (status: number) => expect(status).toBe(StatusCodes.BAD_REQUEST), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.BAD_REQUEST)
                expect(body).toHaveProperty('fields')
                expect(body.fields[0]).toHaveProperty('field')
                expect(body.fields[0]).toHaveProperty('message')
            }
        ],
        [
            new ModelNotFoundError(''),
            (status: number) => expect(status).toBe(StatusCodes.NOT_FOUND), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.NOT_FOUND)
            }
        ],
        [
            new CourseAlreadyFavoritedError(''),
            (status: number) => expect(status).toBe(StatusCodes.CONFLICT), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.CONFLICT)
            }
        ],
        [
            new CourseAlreadyLikedError(''),
            (status: number) => expect(status).toBe(StatusCodes.CONFLICT), 
            (body: any) => {
                expect(body).toHaveProperty('message')
                expect(body).toHaveProperty('timestamp')
                expect(body).toHaveProperty('status', StatusCodes.CONFLICT)
            }
        ]
    ])('handler exception', (ex, expectedStatus, expectedBody) =>{
        let statusMock = jest.fn()
        let jsonMock = jest.fn()
        let res: MockProxy<Response> = mock({ status: statusMock, json: jsonMock })
        statusMock.mockImplementation((status) => {
            expectedStatus(status)
            return res
        })
        jsonMock.mockImplementation((body) => {
            expectedBody(body)
            return res
        })
        handleChain().handle(ex, res)
    })

})