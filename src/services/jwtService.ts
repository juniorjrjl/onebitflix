import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const jwtService = {
    signToken: (payload: string | object | Buffer, expiresIn: string) => jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn})
} 