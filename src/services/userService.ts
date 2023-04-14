import { User } from "../models"
import { UserCreationAttributes } from "../models/User"

export default class UsersService{

    async create(attributes: UserCreationAttributes){
        const user = await User.create(attributes)
        return user
    }

    async update(id: number, attributes: {
        firstName: string
        lastName: string
        phone: string
        birth: Date
        email: string
    }){
        const [affetctedRows, updatedUsers] = await User.update(attributes, {where: { id }, returning: true})
        return updatedUsers[0]
    }

    async updatePassword(id: number, password: string){
        const [affetctedRows, updatedUsers] = await User.update({password}, {where : { id }, returning: true, individualHooks: true})
        return updatedUsers[0]
    }
}