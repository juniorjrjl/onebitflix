import { Response } from "express";
import { AbstractHandler } from "./AbstractHandler";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../responses/errorResponse";
import { ModelNotFoundError } from "../../errors/modelNotFoundError";

export class ModelNotFoundHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof ModelNotFoundError){
            console.error(`ModelNotFoundError ${err}`)
            return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse.buildNotFoundError(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}