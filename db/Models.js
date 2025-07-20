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
        deadline_at: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: new Date(),
        },
        send_at: {
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
        status: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }
)
const StatusModel = sequelize.define('Status', 
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull:false,
            primaryKey: true,
            unique: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        positive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }
)
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
            allowNull:true,
        },
        picture: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        phone:{
            type: DataTypes.STRING,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

const CustomerModel = sequelize.define('Customer',
    {
        id:{
            type: DataTypes.STRING,
            allowNull:false,
            primaryKey: true,
            unique: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull:true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull:true,
        },
    }
)

const AddressModel = sequelize.define('Address', 
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull:false,
            primaryKey: true,
            unique: true,
        },
        street:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        city:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        state:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        zip:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        country:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull:true,
        }
    }
)

const ContactModel = sequelize.define('Contact', 
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
        email:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        phone:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        address:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        type:{
            type: DataTypes.STRING,
            allowNull:false,
        },
    }
)

const FinanceModel = sequelize.define('Finance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    responsible_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    job_id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    job_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    paid: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    due: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    job_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    invoice_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    invoice_paid_date: {
        type: DataTypes.DATE,
        allowNull: true,
    }

})

const CommentsModel = sequelize.define('Comments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull:false,
    }
})

FinanceModel.hasMany(CommentsModel, {
    foreignKey: 'finance_id',
    as: 'comments'
})
CustomerModel.hasMany(FinanceModel, {
    foreignKey: 'customer_id',
    as: 'finances'
})
FinanceModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    as: 'customer'
})
FinanceModel.belongsTo(UserModel, {
    foreignKey: 'responsible_id',
    as: 'responsible'
})
CommentsModel.belongsTo(FinanceModel, {
    foreignKey: 'finance_id',
    as: 'finance'
})
UserModel.hasMany(CommentsModel, {
    foreignKey: 'created_by',
    as: 'comments'
})
CommentsModel.belongsTo(UserModel, {
    foreignKey: 'created_by',
    as: 'user'
})
UserModel.hasMany(FinanceModel, {
    foreignKey: 'responsible_id',
    as: 'finances'
})
UserModel.hasMany(ProjectModel, {
    foreignKey:'user_id',
    as:'projects'
})
ProjectModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as:'users'
})
ProjectModel.hasOne(StatusModel, {
    foreignKey: 'status_id',
    as: 'status_id'
})

CustomerModel.hasMany(AddressModel, {
    foreignKey: 'customer_id',
    as: 'addresses'
})
AddressModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    as: 'customer'
})

// FinanceModel.hasMany(InvoiceModel, {
//     foreignKey: 'invoice_id',
//     as: 'invoices'
// })
// InvoiceModel.belongsTo(InvoiceModel, {
//     foreignKey: 'invoice_id',
//     as: 'finances'
// })

export {ProjectModel, UserModel, CustomerModel, ContactModel, FinanceModel, CommentsModel, AddressModel}