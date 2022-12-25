import express from 'express'
import { adminJs, adminJsRouter } from './adminjs'
import { sequelize } from './database'
import dotenv from 'dotenv'
import { router } from './routes'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
    maxAge: 3600,
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD,OPTIONS',
}))
app.use(express.static('public'))
app.use(express.json())
app.use(adminJs.options.rootPath, adminJsRouter)
app.use(router)
const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, () => {
    sequelize.authenticate().then(() => console.log('DB connection sucessfull.'))
    console.log(`Server started successfuly at port ${PORT}`)
})