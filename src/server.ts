import express from 'express'
import { adminJs, adminJsRouter } from './adminjs'
import { sequelize } from './database'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.static('public'))
app.use(adminJs.options.rootPath, adminJsRouter)

const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, () => {
    sequelize.authenticate().then(() => console.log('DB connection sucessfull.'))
    console.log(`Server started successfuly at port ${PORT}`)
})