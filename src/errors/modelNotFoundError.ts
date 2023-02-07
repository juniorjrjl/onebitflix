import { OneBitFlixError } from "./oneBitFlixError";

export class ModelNotFoundError extends OneBitFlixError{

    constructor(message: string){
        super(message)
    }

}