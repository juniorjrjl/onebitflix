import { Response } from "express";
import { AbstractHandler } from "./AbstractHandler";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../responses/errorResponse";
import { InvalidParamError } from "../../errors/invalidParamError";

export class InvalidParamHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof InvalidParamError){
            console.error(`InvalidParamError ${err}`)
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse.buildBadRequestError(err))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}