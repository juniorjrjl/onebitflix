import { Like } from "../models"

export const saveSerializer = (like: Like) =>{
    return {
        courseId: like.courseId,
        userId: like.userId,
    }
}