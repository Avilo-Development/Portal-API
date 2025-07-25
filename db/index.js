import { Sequelize } from 'sequelize'
import config from '../config/index.js';

export const sequelize = new Sequelize(config.db_main, config.db_user, config.db_password, {
    host: config.db_host,
    dialect: config.db_dialect
})

export default async function connection() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: false, alter:false }).then(() => {
            console.log('Database & Tables created if did not exist!')
        }).catch((error) => {
            console.error('Error creating database & tables:', error);
        });

    } catch (error) {
        console.error(error)
    }
}