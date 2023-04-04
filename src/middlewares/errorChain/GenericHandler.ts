import { Response } from "express";
import { AbstractHandler } from "./AbstractHandler";
import { OneBitFlixError } from "../../errors/oneBitFlixError";
import { StatusCodes } from "http-status-codes";
import { defaultErrorSerializer } from "../../serializers/errorsSerializer";

export class GenericHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof Error || OneBitFlixError){
            console.error(`GenericError ${err}`)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(defaultErrorSerializer())
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}