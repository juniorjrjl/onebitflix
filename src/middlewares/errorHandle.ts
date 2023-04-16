import { Request, Response, NextFunction } from "express";
import { GenericHandler } from "./errorChain/GenericHandler";
import { UnauthorizedHandler } from "./errorChain/UnauthorizedHandler";
import { EmailInUseHandler } from "./errorChain/EmailInUseHandler";
import { InvalidParamHandler } from "./errorChain/InvalidParamHandler";
import { ModelNotFoundHandler } from "./errorChain/ModelNotFoundHandler";
import { CourseAlreadyFavoritedHandler } from "./errorChain/courseAlreadyFavoritedHandler";
import { CourseAlreadyLikedHandler } from "./errorChain/courseAlreadyLikedHandler";

const genericHandler = new GenericHandler(undefined);
const unauthorizedHandler = new UnauthorizedHandler(genericHandler);
const emailInUseHandler = new EmailInUseHandler(unauthorizedHandler);
const invalidParamHandler = new InvalidParamHandler(emailInUseHandler);
const modelNotFoundHandler = new ModelNotFoundHandler(invalidParamHandler);
const courseAlreadyFavoritedHandler = new CourseAlreadyFavoritedHandler(modelNotFoundHandler)
const courseAlreadyLikedHandler = new CourseAlreadyLikedHandler(courseAlreadyFavoritedHandler)

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => courseAlreadyLikedHandler.handle(err, res)