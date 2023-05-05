import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { StatusCodes } from "http-status-codes";
import { UnauthorizedError } from "../../errors/unauthorizedError";
import { unauthorizedErrorSerializer } from "../../serializers/errorsSerializer";

export class UnauthorizedHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof UnauthorizedError){
            console.error(`UnauthorizedError ${err}`)
            return res.status(StatusCodes.UNAUTHORIZED).json(unauthorizedErrorSerializer(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}