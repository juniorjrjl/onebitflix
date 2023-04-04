import express from "express"
import { authController } from "./controllers/authContorller"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"
import { favoritesController } from "./controllers/favoritesController"
import { likesController } from "./controllers/likesController"
import { usersController } from "./controllers/usersController"
import { ensure, ensureQuery } from "./middlewares/auth"
import { authLoginValidators, authRegisterValidators } from "./validatos/authValidator"
import { categoriesIndexValidator, categoriesShowValidator } from "./validatos/categoriesValidator"
import { courseShowValidators, coursesSearchValidators } from "./validatos/coursesValidators"
import { getEpidodesValidators, getWatchTimeEpisodesValidators, setWatchTimeEpisodesValidators } from "./validatos/episodesValidator"
import { favoriteDeleteValidators, favoriteSaveValidators } from "./validatos/favoritesValidator"
import { likeDeleteValidators, likeSaveValidators } from "./validatos/likesValidator"
import { userChangePasswordValidtators, userUpdateValidators } from "./validatos/usersValidators"

const router = express.Router()

router.get('/categories', ...[ensure, categoriesIndexValidator()], categoriesController.index)
router.get('/categories/:id', ...[ensure, categoriesShowValidator()], categoriesController.show)

router.get('/courses/search', ...[ensure, coursesSearchValidators()], coursesController.search)
router.get('/courses/featured', ensure,  coursesController.featured)
router.get('/courses/newest', coursesController.newest)
router.get('/courses/popular', ensure, coursesController.popular)
router.get('/courses/:id', ...[ensure, courseShowValidators()], coursesController.show)

router.get('/episodes/stream', ...[ensureQuery, getEpidodesValidators()], episodesController.stream)
router.get('/episodes/:id/watchTime', ...[ensure, getWatchTimeEpisodesValidators()], episodesController.getWatchTime)
router.post('/episodes/:id/watchTime', ...[ensure, setWatchTimeEpisodesValidators()], episodesController.setWatchTime)

router.post('/auth/register', authRegisterValidators(), authController.register)
router.post('/auth/login', authLoginValidators(), authController.login)

router.post('/favorites', ...[ensure, favoriteSaveValidators()], favoritesController.save)
router.get('/favorites', ensure, favoritesController.index)
router.delete('/favorites/:id', ...[ensure, favoriteDeleteValidators()], favoritesController.delete)

router.post('/likes', ...[ensure, likeSaveValidators()], likesController.save)
router.delete('/likes/:id', ...[ensure, likeDeleteValidators()], likesController.delete)

router.get('/users/current/watching', ensure, usersController.watching)
router.get('/users/current', ensure, usersController.show)
router.put('/users/current', ...[ensure, userUpdateValidators()], usersController.update)
router.put('/users/current/password', ...[ensure, userChangePasswordValidtators()], usersController.changePassword)

export { router }