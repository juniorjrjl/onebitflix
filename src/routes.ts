import express from "express"
import { authController } from "./controllers/authContorller"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"
import { favoritesController } from "./controllers/favoritesController"
import { ensure } from "./middlewares/auth"

const router = express.Router()

router.get('/categories', ensure, categoriesController.index)
router.get('/categories/:id', ensure, categoriesController.show)

router.get('/courses/search', ensure, coursesController.search)
router.get('/courses/featured', ensure,  coursesController.featured)
router.get('/courses/newest', coursesController.newest)
router.get('/courses/:id', ensure, coursesController.show)

router.get('/episodes/stream', ensure, episodesController.stream)

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)

router.post('/favorites', ensure, favoritesController.save)
router.get('/favorites', ensure, favoritesController.index)
router.delete('/favorites/:id', ensure, favoritesController.delete)

export { router }