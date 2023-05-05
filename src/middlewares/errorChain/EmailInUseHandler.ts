import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { StatusCodes } from "http-status-codes";
import { EmailInUseError } from "../../errors/emailInUseError";
import { conflictErrorSerializer } from "../../serializers/errorsSerializer";

export class EmailInUseHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof EmailInUseError){
            console.error(`EmailInUseError ${err}`)
            return res.status(StatusCodes.CONFLICT).json(conflictErrorSerializer(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}