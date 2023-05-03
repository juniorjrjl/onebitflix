import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { StatusCodes } from "http-status-codes";
import { InvalidParamError } from "../../errors/invalidParamError";
import { BadRequestErrorSerializer } from "../../serializers/errorsSerializer";

export class InvalidParamHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof InvalidParamError){
            console.error(`InvalidParamError ${err}`)
            return res.status(StatusCodes.BAD_REQUEST).json(BadRequestErrorSerializer(err.message, err.fields))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}