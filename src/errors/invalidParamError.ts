import { OneBitFlixError } from "./oneBitFlixError"


export class InvalidParamError extends OneBitFlixError{

    fields: InvalidParamField[]

    constructor(message: string, fields: InvalidParamField[] = []){
        super(message)
        this.fields = fields
    }

}

export class InvalidParamField{

    readonly field: string
    readonly message: string

    constructor(field: string, message: string){
        this.field = field
        this.message = message
    }

    static builder(): InvalidParamFieldBuilder{
        return new InvalidParamFieldBuilder()
    }

}

class InvalidParamFieldBuilder{

    field = ""
    message = ""

    withField(field: string): InvalidParamFieldBuilder{
        this.field = field
        return this
    }

    withMessage(message: string): InvalidParamFieldBuilder{
        this.message = message
        return this
    }

    build(): InvalidParamField{
        return new InvalidParamField(this.field, this.message)
    }

}