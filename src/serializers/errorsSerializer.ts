import { StatusCodes } from "http-status-codes"
import { InvalidParamField } from "../errors/invalidParamError"

const baseErrorSerializer = (message: String, status: Number, timestamp: Date = new Date()) =>{
    return {
        message,
        status,
        timestamp
    }
}

export const defaultErrorSerializer = () => baseErrorSerializer("Ocorreu um erro desconhecido, entre em contato com o administrador", StatusCodes.INTERNAL_SERVER_ERROR)

export const notFoundErrorSerializer = (message: String) => baseErrorSerializer(message, StatusCodes.NOT_FOUND)

export const badRequestErrorSerializer = (message: String, fields: InvalidParamField[] | null) => {
    type responseType = {[key: string]: any}
    let response: responseType = baseErrorSerializer(message, StatusCodes.BAD_REQUEST)
    if ((fields) && (fields.length)){
        response.fields = fields.map((f: InvalidParamField) => {
            return {
                field: f.field,
                message: f.message
            }
        })
    }
    return response
}

export const conflictErrorSerializer = (message: String) => baseErrorSerializer(message, StatusCodes.CONFLICT)

export const unauthorizedErrorSerializer = (message: String) => baseErrorSerializer(message, StatusCodes.UNAUTHORIZED)