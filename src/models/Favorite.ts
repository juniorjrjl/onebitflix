import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"
import { Course, CourseInstance } from "./Course"
import { User, UserInstance } from "./User"

export interface Favorite {
    userId: number
    courseId: number
}

export interface FavoriteInstance extends Model<Favorite>, Favorite {
    Course?: CourseInstance
    User?: UserInstance
}

export const Favorite = sequelize.define<FavoriteInstance, Favorite>('Favorite', {
    userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    courseId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
})