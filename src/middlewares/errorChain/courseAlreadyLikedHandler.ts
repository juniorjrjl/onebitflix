import { Response } from "express";
import { AbstractHandler } from "./abstractHandler";
import { CourseAlreadyLikedError } from "../../errors/courseAlreadyLikedError";
import { StatusCodes } from "http-status-codes";
import { conflictErrorSerializer } from "../../serializers/errorsSerializer";

export class CourseAlreadyLikedHandler  extends AbstractHandler{

    handle(err: Error, res: Response<any, Record<string, any>>): Response<any, Record<string, any>> | undefined {
        if (err instanceof CourseAlreadyLikedError){
            console.error(`CourseAlreadyLikedError ${err}`)
            return res.status(StatusCodes.CONFLICT).json(conflictErrorSerializer(err.message))
        }
        return this.next ? this.next.handle(err, res) : undefined;
    }
}