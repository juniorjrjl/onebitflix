import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { PayloadDTO } from '../dto/payloadDTO'

export default class JwtService{

    sign(payload: PayloadDTO, expiresIn: string | number | undefined){
        return jwt.sign({ ...payload }, process.env.JWT_SECRET!, { expiresIn })
    }

    verify(token: string, callback: jwt.VerifyCallback){
        jwt.verify(token, process.env.JWT_SECRET!, callback)
    }

} 