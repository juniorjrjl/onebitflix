import { User } from "../models"
import { UserCreationAttributes } from "../models/User"

export const usersService = {
    create: async (attributes: UserCreationAttributes) =>{
        const user = await User.create(attributes)
        return user
    }
}