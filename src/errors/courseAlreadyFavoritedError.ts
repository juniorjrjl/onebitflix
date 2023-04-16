import { OneBitFlixError } from "./oneBitFlixError";

export class CourseAlreadyFavoritedError extends OneBitFlixError{

    constructor(message: string){
        super(message)
    }

}