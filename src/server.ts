import express from 'express'
import { adminJs, adminJsRouter } from './adminjs'
import { database } from './database'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.static('public'))
app.use(adminJs.options.rootPath, adminJsRouter)

const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, async () => {
    await database.authenticate().then(() => console.log('DB connection sucessfull.'))
    console.log(`Server started successfuly at port ${PORT}`)
})