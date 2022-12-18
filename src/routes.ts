import express from "express"
import { authController } from "./controllers/authContorller"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"

const router = express.Router()

router.get('/categories', categoriesController.index)
router.get('/categories/:id', categoriesController.show)

router.get('/courses/search', coursesController.search)
router.get('/courses/featured', coursesController.featured)
router.get('/courses/newest', coursesController.newest)
router.get('/courses/:id', coursesController.show)

router.get('/episodes/stream', episodesController.stream)

router.post('/auth/register', authController.register)

export { router }