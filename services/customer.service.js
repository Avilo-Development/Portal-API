import { col, fn } from 'sequelize';
import { CustomerModel as model, AddressModel as umodel, FinanceModel as cmodel } from '../db/Models.js'

export default class CustomerService {
    async getAll() {
        return await model.findAll({
            include: [{
                model: umodel,
                as: 'addresses',
            }],
            include: [{
                model: cmodel,
                as: 'finances',
                attributes: [
                    [fn('COUNT', col('finances.id')), 'totalItems'],
                    [fn('SUM', col('finances.amount')), 'totalAmount'],
                    [fn('SUM', col('finances.paid')), 'totalPaid'],
                    [fn('SUM', col('finances.due')), 'totalDue'],
                ]
            }],
            group: ['id'],
        })
    }
    async get(id) {
        return await model.findOne({ where: { id: id } })
    }
    async create(customer) {
        return await model.create(customer);
    }
    async update(id, customer) {
        return await model.update(customer, { where: { id: id } })
    }
    async delete(id) {
        return await model.destroy({ where: { id: id } })
    }
}