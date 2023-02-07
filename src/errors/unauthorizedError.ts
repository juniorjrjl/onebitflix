import { OneBitFlixError } from "./oneBitFlixError";

export class UnauthorizedError extends OneBitFlixError{

    constructor(message: string){
        super(message)
    }

}