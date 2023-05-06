import { Request, Response, NextFunction } from "express";
import container from "../container";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => container.resolve('errorHandlerChain').handle(err, res)