// src/database/index.ts

import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()
export const database = new Sequelize(process.env.DATABASE!, process.env.USERNAME!, process.env.PASSWORD, { host: process.env.HOST, dialect: 'postgres'})