import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import { WatchTime, WatchTimeInstance } from "./WatchTime";
import { Course } from "./Course";

export interface Episode{
    id: number
    name: string
    synopsis: string
    order: number
    videoUrl: string
    secondsLong: number
    courseId: number
    WatchTime?: WatchTime
    Course?: Course
}

export interface EpisodeCreationAttributes extends Optional<Episode, 'id' | 'videoUrl'| 'secondsLong'> {}

export interface EpisodeInstance extends Model<Episode, EpisodeCreationAttributes>, Episode {
    watchTime?: WatchTimeInstance
}

export const Episode = sequelize.define<EpisodeInstance, Episode>('Episode', {
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
    order: {
        allowNull: false,
        type: DataTypes.STRING
    },
    videoUrl: {
        type: DataTypes.STRING
    },
    secondsLong: {
        type: DataTypes.INTEGER
    },
    courseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}, {underscored: true})