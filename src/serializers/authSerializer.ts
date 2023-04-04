import { User } from "../models";

export const registerSerializer = (user: User) =>{
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        birth: user.birth,
    }
}

export const loginSerializer = (token: String) => {
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1)
    const expiresIn = currentDate.getTime()
    return {
        type: 'Bearer',
        token,
        expiresIn
    }
}