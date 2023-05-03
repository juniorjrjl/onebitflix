import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { StatusCodes } from "http-status-codes";
import { ModelNotFoundError } from "../../errors/modelNotFoundError";
import { notFoundErrorSerializer } from "../../serializers/errorsSerializer";

export class ModelNotFoundHandler extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response | undefined {
        if (err instanceof ModelNotFoundError){
            console.error(`ModelNotFoundError ${err}`)
            return res.status(StatusCodes.NOT_FOUND).json(notFoundErrorSerializer(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }

}