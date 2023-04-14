import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()
export const sequelize = new Sequelize(process.env.DATABASE!, process.env.USERNAME!, process.env.PASSWORD, { host: process.env.HOST, dialect: 'postgres' })