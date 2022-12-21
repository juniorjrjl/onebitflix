import express from "express"
import { authController } from "./controllers/authContorller"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"
import { ensure } from "./middlewares/auth"

const router = express.Router()

router.get('/categories', ensure, categoriesController.index)
router.get('/categories/:id', ensure, categoriesController.show)

router.get('/courses/search', ensure, coursesController.search)
router.get('/courses/featured', ensure,  coursesController.featured)
router.get('/courses/newest', coursesController.newest)
router.get('/courses/:id', ensure, coursesController.show)

router.get('/episodes/stream', episodesController.stream)

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)

export { router }