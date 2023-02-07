class LoginResponse{

    readonly type: string
    readonly token: string
    readonly expiresIn: number

    constructor(token: string, expiresIn: number){
        this.type = 'Bearer'
        this.token = token
        this.expiresIn = expiresIn
    }

}