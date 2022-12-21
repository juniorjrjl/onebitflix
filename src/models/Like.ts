import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"
import { Course } from "./Course"
import { User } from "./User"

export interface Like {
    userId: number
    courseId: number
}

export interface LikeInstance extends Model<Like>, Like { }

export const Like = sequelize.define<LikeInstance, Like>('Like', {
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
}, {underscored: true})