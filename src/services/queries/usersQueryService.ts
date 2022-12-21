import { User } from "../../models"

export const usersQueryService = {
    findByemail:async (email: string) =>{
        const user = await User.findOne({where: { email }})
        return user
    }
}