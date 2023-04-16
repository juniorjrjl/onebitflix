import { EmailInUseError } from "../errors/emailInUseError"
import { ModelNotFoundError } from "../errors/modelNotFoundError"
import { User } from "../models"
import { UserCreationAttributes } from "../models/User"
import { MockProxy, mock } from "jest-mock-extended"
import UsersQueryService from "./queries/usersQueryService"

export default class UsersService{

    constructor(private readonly usersQueryService: UsersQueryService){}

    async create(attributes: UserCreationAttributes){
        try{
            await this.usersQueryService.findByEmail(attributes.email)
            throw new EmailInUseError(`O e-mail ${attributes.email} esta sendo usado por outro usuário`)
        }catch(err){
            if (!(err instanceof ModelNotFoundError)) throw err
        }
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
        await this.usersQueryService.findById(id)

        try{
            const userWithEmail = await this.usersQueryService.findByEmail(attributes.email)
            if (userWithEmail.id !== id) throw new EmailInUseError(`O e-mail ${attributes.email} esta sendo usado por outro usuário`)
        }catch(err){
            if (!(err instanceof ModelNotFoundError)) throw err
        }

        const [affetctedRows, updatedUsers] = await User.update(attributes, {where: { id }, returning: true})
        return updatedUsers[0]
    }

    async updatePassword(id: number, password: string){
        await this.usersQueryService.findById(id)
        const [affetctedRows, updatedUsers] = await User.update({password}, {where : { id }, returning: true, individualHooks: true})
        return updatedUsers[0]
    }
}