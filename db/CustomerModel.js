import { DataTypes } from "sequelize";
import {sequelize} from './index.js'

const CustomerModel = sequelize.define('Customer',
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
        company: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull:false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull:false,
        },
    }
)