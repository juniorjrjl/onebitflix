import { Response } from "express";
import { AbstractHandler } from "./AbstractHandler";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../responses/errorResponse";
import { UnauthorizedError } from "../../errors/unauthorizedError";

export class UnauthorizedHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof UnauthorizedError){
            console.error(`UnauthorizedError ${err}`)
            return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse.buildUnauthorizedError(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}