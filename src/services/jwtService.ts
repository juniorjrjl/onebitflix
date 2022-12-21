import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const jwtService = {
    sign: (payload: string | object | Buffer, expiresIn: string) => jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn}),

    verify: (token: string, callback: jwt.VerifyCallback) => jwt.verify(token, process.env.JWT_SECRET!, callback)
} 