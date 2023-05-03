import { asClass, asFunction, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import UsersService from "./services/usersService";
import LikesService from "./services/likesService";
import JwtService from "./services/jwtService";
import FavoritesService from "./services/favoritesService";
import EpisodesService from "./services/episodesService";
import UsersQueryService from "./services/queries/usersQueryService";
import LikesQueryService from "./services/queries/likesQueryService";
import FavoritesQueryService from "./services/queries/favoritesQueryService";
import EpisodesQueryService from "./services/queries/episodesQueryService";
import CoursesQueryService from "./services/queries/coursesQueryService";
import CategoriesQueryService from "./services/queries/categoriesQueryService";
import { GenericHandler } from "./middlewares/errorChain/genericHandler";
import { UnauthorizedHandler } from "./middlewares/errorChain/unauthorizedHandler";
import { EmailInUseHandler } from "./middlewares/errorChain/emailInUseHandler";
import { InvalidParamHandler } from "./middlewares/errorChain/invalidParamHandler";
import { ModelNotFoundHandler } from "./middlewares/errorChain/modelNotFoundHandler";
import { CourseAlreadyFavoritedHandler } from "./middlewares/errorChain/courseAlreadyFavoritedHandler";
import { CourseAlreadyLikedHandler } from "./middlewares/errorChain/courseAlreadyLikedHandler";
import { AbstractHandler } from "./middlewares/errorChain/abstractHandler";

const handleChain = (): AbstractHandler => {
    const genericHandler = new GenericHandler(undefined);
    const unauthorizedHandler = new UnauthorizedHandler(genericHandler);
    const emailInUseHandler = new EmailInUseHandler(unauthorizedHandler);
    const invalidParamHandler = new InvalidParamHandler(emailInUseHandler);
    const modelNotFoundHandler = new ModelNotFoundHandler(invalidParamHandler);
    const courseAlreadyFavoritedHandler = new CourseAlreadyFavoritedHandler(modelNotFoundHandler)
    return new CourseAlreadyLikedHandler(courseAlreadyFavoritedHandler)
}

interface ICradle{

    usersService: UsersService
    likesService: LikesService
    jwtService: JwtService
    favoritesService: FavoritesService
    episodesService: EpisodesService
    usersQueryService: UsersQueryService
    likesQueryService: LikesQueryService
    favoritesQueryService: FavoritesQueryService
    episodesQueryService: EpisodesQueryService
    coursesQueryService: CoursesQueryService
    categoriesQueryService: CategoriesQueryService
    errorHandlerChain: AbstractHandler
}


const container = createContainer<ICradle>({injectionMode: 'CLASSIC'})

export const loadContainer = (app: Application) => {
    container.register({ usersService: asClass(UsersService).scoped() })
    container.register({ likesService: asClass(LikesService).scoped() })
    container.register({ jwtService: asClass(JwtService).scoped() })
    container.register({ favoritesService: asClass(FavoritesService).scoped() })
    container.register({ episodesService: asClass(EpisodesService).scoped() })
    container.register({ usersQueryService: asClass(UsersQueryService).scoped() })
    container.register({ likesQueryService: asClass(LikesQueryService).scoped() })
    container.register({ favoritesQueryService: asClass(FavoritesQueryService).scoped() })
    container.register({ episodesQueryService: asClass(EpisodesQueryService).scoped() })
    container.register({ coursesQueryService: asClass(CoursesQueryService).scoped() })
    container.register({ categoriesQueryService: asClass(CategoriesQueryService).scoped() })
    container.register({ errorHandlerChain : asFunction(handleChain).singleton() })
    app.use(scopePerRequest(container));
}

export default container;