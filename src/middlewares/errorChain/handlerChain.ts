import { AbstractHandler } from "./abstractHandler";
import { CourseAlreadyFavoritedHandler } from "./courseAlreadyFavoritedHandler";
import { CourseAlreadyLikedHandler } from "./courseAlreadyLikedHandler";
import { EmailInUseHandler } from "./emailInUseHandler";
import { GenericHandler } from "./genericHandler";
import { InvalidParamHandler } from "./invalidParamHandler";
import { ModelNotFoundHandler } from "./modelNotFoundHandler";
import { UnauthorizedHandler } from "./unauthorizedHandler";

export const handleChain = (): AbstractHandler => {
    const genericHandler = new GenericHandler(undefined);
    const unauthorizedHandler = new UnauthorizedHandler(genericHandler);
    const emailInUseHandler = new EmailInUseHandler(unauthorizedHandler);
    const invalidParamHandler = new InvalidParamHandler(emailInUseHandler);
    const modelNotFoundHandler = new ModelNotFoundHandler(invalidParamHandler);
    const courseAlreadyFavoritedHandler = new CourseAlreadyFavoritedHandler(modelNotFoundHandler)
    return new CourseAlreadyLikedHandler(courseAlreadyFavoritedHandler)
}