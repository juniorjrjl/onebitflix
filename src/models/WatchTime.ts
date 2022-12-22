import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"


export interface WatchTimeAttributes {
    seconds: number
    userId: number
    episodeId: number
    createdAt: Date
    updatedAt: Date
}

export interface WatchTimeInstance extends Model<WatchTimeAttributes>, WatchTimeAttributes { }

export const WatchTime = sequelize.define<WatchTimeInstance, WatchTimeAttributes>('WatchTime', {
    seconds: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    episodeId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: { model: 'episodes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
},{underscored: true})