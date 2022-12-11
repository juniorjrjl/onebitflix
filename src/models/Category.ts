import { sequelize } from '../database';
import { DataTypes, Model, Optional } from 'sequelize';

export interface Categorty{
    id: number,
    name: string,
    position: number
}

export interface CategoryCreationAttributes extends Optional<Categorty, 'id'> {}

export interface CategoryInstance extends Model<Categorty, CategoryCreationAttributes>, Categorty {}

export const Category = sequelize.define<CategoryInstance, Categorty>('Category',{
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    position: {
        allowNull: false,
        unique: true,
        type: DataTypes.INTEGER
    },
}, {underscored: true})