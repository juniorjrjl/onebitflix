import { asClass, createContainer } from "awilix";
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

export const loadContainer = (app: Application) => {
    const Container = createContainer({injectionMode: 'CLASSIC'})
    Container.register({ usersService: asClass(UsersService).scoped() })
    Container.register({ likesService: asClass(LikesService).scoped() })
    Container.register({ jwtService: asClass(JwtService).scoped() })
    Container.register({ favoritesService: asClass(FavoritesService).scoped() })
    Container.register({ episodesService: asClass(EpisodesService).scoped() })
    Container.register({ usersQueryService: asClass(UsersQueryService).scoped() })
    Container.register({ likesQueryService: asClass(LikesQueryService).scoped() })
    Container.register({ favoritesQueryService: asClass(FavoritesQueryService).scoped() })
    Container.register({ episodesQueryService: asClass(EpisodesQueryService).scoped() })
    Container.register({ coursesQueryService: asClass(CoursesQueryService).scoped() })
    Container.register({ categoriesQueryService: asClass(CategoriesQueryService).scoped() })
    app.use(scopePerRequest(Container));
}