import dotenv from 'dotenv'
dotenv.config()

process.env.DATABASE = process.env.DATABASE?.replace(/_development/, '_test')