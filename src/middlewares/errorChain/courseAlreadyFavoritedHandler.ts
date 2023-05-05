import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { CourseAlreadyFavoritedError } from "../../errors/courseAlreadyFavoritedError";
import { StatusCodes } from "http-status-codes";
import { conflictErrorSerializer } from "../../serializers/errorsSerializer";

export class CourseAlreadyFavoritedHandler  extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response<any, Record<string, any>> | undefined {
        if (err instanceof CourseAlreadyFavoritedError){
            console.error(`CourseAlreadyFavoritedError ${err}`)
            return res.status(StatusCodes.CONFLICT).json(conflictErrorSerializer(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }
}