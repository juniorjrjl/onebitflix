import { sequelize } from "../database";
import { DataTypes, Model, Optional } from 'sequelize'
import { Episode } from "./Episode";

export interface Course {
    id: number
    name: string
    synopsis: string
    thumbnailUrl: string
    featured: boolean
    categoryId: number
    createdAt: Date
    updatedAt: Date
    Episodes?: Episode[]
}

export interface CourseCreationAttributes extends Optional<Course, 'id' | 'thumbnailUrl' | 'featured' | 'createdAt' | 'updatedAt' | 'Episodes'>{}

export interface CourseInstance extends Model<Course, CourseCreationAttributes>, Course {}

export const Course = sequelize.define<CourseInstance, Course>('Course',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    synopsis: {
        allowNull: false,
        type: DataTypes.TEXT
    },
    thumbnailUrl: {
        type: DataTypes.STRING
    },
    featured: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
    categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
}, {underscored: true})