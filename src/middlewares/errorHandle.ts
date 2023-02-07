import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { EmailInUseError } from "../errors/emailInUseError";
import { InvalidParamError } from "../errors/invalidParamError";
import { ModelNotFoundError } from "../errors/modelNotFoundError";
import { OneBitFlixError } from "../errors/oneBitFlixError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { ErrorResponse } from "../responses/errorResponse";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{

    console.error('Happened a error!')
    if (err instanceof ModelNotFoundError){
        console.error(`ModelNotFoundError ${err}`)
        return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse.buildNotFoundError(err.message))
    } else if (err instanceof InvalidParamError){
        console.error(`InvalidParamError ${err}`)
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse.buildBadRequestError(err))
    }else if (err instanceof EmailInUseError){
        console.error(`EmailInUseError ${err}`)
        return res.status(StatusCodes.CONFLICT).json(ErrorResponse.buildConflictError(err.message))
    }else if (err instanceof UnauthorizedError){
        console.error(`UnauthorizedError ${err}`)
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse.buildUnauthorizedError(err.message))
    }else if (err instanceof Error || OneBitFlixError){
        console.error(`GenericError ${err}`)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse.buildDefaultError())
    }

}