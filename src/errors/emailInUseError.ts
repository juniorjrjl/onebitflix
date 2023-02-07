import { OneBitFlixError } from "./oneBitFlixError"

export class EmailInUseError extends OneBitFlixError{

    constructor(message: string){
        super(message)
    }

}