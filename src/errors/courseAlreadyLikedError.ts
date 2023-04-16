import { OneBitFlixError } from "./oneBitFlixError";

export class CourseAlreadyLikedError extends OneBitFlixError{

    constructor(message: string){
        super(message)
    }

}