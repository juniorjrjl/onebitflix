import { Category, Course } from "../models";
import { PageSerializer } from "./commonsSerializer";

export const showSerializer = (category: Category) => {
    return {
        id: category.id,
        name: category.name,
        courses: category.Courses ? category.Courses.map(c => showCourses(c)) : []
    }
}

const showCourses = (course: Course) => {
    return {
        id: course.id,
        name: course.name,
        synopsis: course.synopsis,
        thumbnailUrl: course.thumbnailUrl
    }
}

export const indexSerializer = (pageable: {page: number, perPage: number, total: number, content: Category[]}) => PageSerializer(pageable, PageRow)

const PageRow = (category: Category) => {
    return{
        id: category.id,
        name: category.name,
        position: category.position
    }
}