import { StatusCodes } from "http-status-codes";
import { InvalidParamError } from "../errors/invalidParamError";

class ErrorFieldResponse{

    readonly name: string
    readonly message: string

    constructor(name: string, message: string){
        this.name = name
        this.message = message
    }

}

export class ErrorResponse{

    message: string
    status: number
    timestamp: Date
    fields: ErrorFieldResponse[]

    private constructor(message: string, status: number, fields: ErrorFieldResponse[] = [], timestamp: Date = new Date()){
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
        this.fields = fields
    }

    public static buildDefaultError(): ErrorResponse{
        return new ErrorResponse("Ocorreu um erro desconhecido, entre em contato com o administrador", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    public static buildNotFoundError(message: string): ErrorResponse{
        return new ErrorResponse(message, StatusCodes.NOT_FOUND);
    }

    public static buildBadRequestError(err: InvalidParamError): ErrorResponse{
        return new ErrorResponse(err.message, StatusCodes.BAD_REQUEST, err.fields.map(f => new ErrorFieldResponse(f.field, f.message)));
    }

    public static buildConflictError(message: string): ErrorResponse{
        return new ErrorResponse(message, StatusCodes.CONFLICT)
    }

    public static buildUnauthorizedError(message: string): ErrorResponse{
        return new ErrorResponse(message, StatusCodes.UNAUTHORIZED)
    }

}