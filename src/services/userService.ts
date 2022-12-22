import { User } from "../models"
import { UserCreationAttributes } from "../models/User"

export const usersService = {
    create: async (attributes: UserCreationAttributes) =>{
        const user = await User.create(attributes)
        return user
    },

    update: async(id: number, attributes: {
        firstName: string
        lastName: string
        phone: string
        birth: Date
        email: string
    }) =>{
        const [affetctedRows, updatedUsers] = await User.update(attributes, {where: { id }, returning: true})
        return updatedUsers[0]
    }
}