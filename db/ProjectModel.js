import { DataTypes } from "sequelize";
import {sequelize} from './index.js'

const ProjectModel = sequelize.define('Project',
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull:false,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        estimate: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        hcp_url: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        address:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        deadline_date: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: new Date(),
        },
        send_date: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: new Date()
        },
        budget: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        quote: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        visit: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
        },
        progress: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
        },
        finished: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
        },
    }
)