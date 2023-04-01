import { Request, Response, NextFunction } from "express";
import { GenericHandler } from "./errorChain/GenericHandler";
import { UnauthorizedHandler } from "./errorChain/UnauthorizedHandler";
import { EmailInUseHandler } from "./errorChain/EmailInUseHandler";
import { InvalidParamHandler } from "./errorChain/InvalidParamHandler";
import { ModelNotFoundHandler } from "./errorChain/ModelNotFoundHandler";

const genericHandler = new GenericHandler(undefined);
const unauthorizedHandler = new UnauthorizedHandler(genericHandler);
const emailInUseHandler = new EmailInUseHandler(unauthorizedHandler);
const invalidParamHandler = new InvalidParamHandler(emailInUseHandler);
const modelNotFoundHandler = new ModelNotFoundHandler(invalidParamHandler);

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => modelNotFoundHandler.handle(err, res)