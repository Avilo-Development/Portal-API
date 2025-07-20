import { DataTypes } from "sequelize";
import {sequelize} from './index.js'

const UserModel = sequelize.define('User',
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull:false,
            primaryKey: true,
            unique: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        hcp_link: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        picture: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)