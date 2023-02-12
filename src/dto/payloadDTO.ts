export class PayloadDTO{

    readonly id: number
    readonly firstName: string
    readonly email: string

    constructor(id: number, firstName: string, email: string){
        this.id = id
        this.firstName = firstName
        this.email = email
    }

}