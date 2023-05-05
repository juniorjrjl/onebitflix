import { Course, Episode } from "../models"
import { PageSerializer } from "./commonsSerializer"

export const featuredSerializer = (courses: Course[]) =>{
    if (!courses.length) return []
    
    return courses.map(course => {
        return{
            id: course.id,
            name: course.name,
            synopsis: course.synopsis,
            thumbnailUrl: course.thumbnailUrl,
            featured: course.featured,
            categoryId: course.categoryId,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }
    })
}

export const newestSerializer = (courses: Course[]) =>{
    if (!courses.length) return []

    return courses.map(course => {
        return{
            id: course.id,
            name: course.name,
            synopsis: course.synopsis,
            thumbnailUrl: course.thumbnailUrl,
            featured: course.featured,
            categoryId: course.categoryId,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }
    })
}

export const showSerializer = (course: Course, liked: boolean, favorited: boolean) =>{
    return{
        id: course.id,
        name: course.name,
        synopsis: course.synopsis,
        thumbnailUrl: course.thumbnailUrl,
        liked,
        favorited,
        episodes: course.Episodes && course.Episodes.length ? course.Episodes.map(e => showEpisodes(e)) : []
    }
}

const showEpisodes = (episode: Episode) =>{
    return{
        id: episode.id,
        name: episode.name,
        synopsis: episode.synopsis,
        order: episode.order,
        videoUrl: episode.videoUrl,
        secondsLong: episode.secondsLong
    }
}

export const searchSerializer = (pageable: {page: number, perPage: number, total: number, content: Course[]}) => PageSerializer(pageable, PageRow)

const PageRow = (course: Course) =>{
    return{
        id: course.id,
        name: course.name,
        synopsis: course.synopsis,
        thumbnailUrl: course.thumbnailUrl
    }
}

export const popularSerializer = (courses: any[]) =>{
    if (!courses.length) return []

    return courses.map(c => {
        return {
            id: c.id,
            name: c.name,
            synopsis: c.synopsis,
            likes: c.likes
        }
    })
}