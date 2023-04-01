import { Response } from "express";
import { AbstractHandler } from "./AbstractHandler";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../responses/errorResponse";
import { EmailInUseError } from "../../errors/emailInUseError";

export class EmailInUseHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof EmailInUseError){
            console.error(`EmailInUseError ${err}`)
            return res.status(StatusCodes.CONFLICT).json(ErrorResponse.buildConflictError(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}