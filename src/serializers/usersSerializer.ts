import { Course, Episode, User, WatchTime } from "../models";

export const updateSerializer = (user: User) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        birth: user.birth,
        email: user.email,
        role: user.role
    }
}

export const showSerializer = (user: User) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        birth: user.birth,
        email: user.email,
        role: user.role
    }
}

export const watchingSerializer = (episodes: Episode[]) => {
    if (!episodes.length) return []

    return episodes.map(e =>{
        return {
            id: e.id,
            name: e.name,
            synopsis: e.synopsis,
            order: e.order,
            videoUrl: e.videoUrl,
            secondsLong: e.secondsLong,
            watchTime: e.WatchTime ? watchingTimeSerializer(e.WatchTime): null,
            course: e.Course ? watchingCourseSerializer(e.Course) : null
        }
    })
}

const watchingTimeSerializer = (watchTime: WatchTime) =>{
    return {
        seconds: watchTime.seconds,
        createdAt: watchTime.createdAt,
        updatedAt: watchTime.updatedAt
    }
}

const watchingCourseSerializer = (course: Course) =>{
    return {
        id: course.id,
        name: course.name,
        synopsis: course.synopsis,
        thumbnailUrl: course.thumbnailUrl,
        featured: course.featured,
        categoryId: course.categoryId
    }
}