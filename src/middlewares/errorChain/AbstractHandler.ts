import { Response } from "express";

export abstract class AbstractHandler {

    constructor(protected next: AbstractHandler | undefined){}


    abstract handle(err: Error, res: Response): Response | undefined;

}