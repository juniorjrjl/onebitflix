import { Course, Favorite } from "../models"

export const saveSerializer = (favorite: Favorite) =>{
    return {
        courseId: favorite.courseId,
        userId: favorite.userId,
    }
}

export const indexSerializer = (favorite: {userId: number, courses: (Course | undefined)[]}) => {
    return{
        userId: favorite.userId,
        courses: favorite.courses ? indexCoursesSerializer(favorite.courses) : []
    }
}

const indexCoursesSerializer = (courses: (Course | undefined)[]) => {
    return courses.filter(c =>  c).map(c => {
            return {
                id: c!.id,
                name: c!.name,
                synopsis: c!.synopsis,
                thumbnailUrl: c!.thumbnailUrl
            }
        }
    )
}