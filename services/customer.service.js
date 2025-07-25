import { col, fn, literal, Op } from 'sequelize';
import { CustomerModel as model, AddressModel as umodel, FinanceModel as cmodel, UserModel as smodel, CommentsModel as zmodel } from '../db/Models.js'

const config = ({ page_size, order_by, order, page }) => {
    const offset = (page - 1) * page_size
    return {
        limit: parseInt(page_size),
        offset: parseInt(offset),
        order: [[order_by, order]],
    }
}
const return_page = ({ result, page_size, page }) => {
    const total_items = result.length
    const total_pages = Math.ceil(total_items / page_size);

    return {
        total_items,
        total_pages,
        page,
        page_size,
        data: result
    }
}

export default class CustomerService {
    async getAll({ order = 'DESC', page_size = 50, page = 1, order_by = 'createdAt' }) {
        const customers = await model.findAndCountAll({
            ...config({ page_size, order_by, order, page }),
            include: [{
                model: umodel,
                as: 'addresses',
            }],
        })
        const financeTotals = await cmodel.findAll({
            attributes: [
                'customer_id',
                [fn('COUNT', col('id')), 'totalItems'],
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue']
            ],
            group: ['customer_id'],
            raw: true
        });
        const merged = customers.rows.map((cust) => {
            const finance = financeTotals.find(f => f.customer_id === cust.id) || {};
            return {
                ...cust.toJSON(),
                finances: {
                    totalItems: Number(finance.totalItems || 0),
                    totalAmount: Number(finance.totalAmount || 0),
                    totalPaid: Number(finance.totalPaid || 0),
                    totalDue: Number(finance.totalDue || 0)
                }
            };
        });
        return return_page({ result: merged, page_size, page })
    }
    async getBy(id) {
        const customers = await model.findAll({
            where: {
                [Op.or]: [
                    { id: id },
                    { name: { [Op.like]: `%${id}%` } }
                ]
            },
        })
        const financeTotals = await cmodel.findAll({
            attributes: [
                'customer_id',
                [fn('COUNT', col('id')), 'totalItems'],
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue']
            ],
            group: ['customer_id'],
            raw: true
        });
        const merged = customers.map((cust) => {
            const finance = financeTotals.find(f => f.customer_id === cust.id) || {};
            return {
                ...cust.toJSON(),
                finances: {
                    totalItems: Number(finance.totalItems || 0),
                    totalAmount: Number(finance.totalAmount || 0),
                    totalPaid: Number(finance.totalPaid || 0),
                    totalDue: Number(finance.totalDue || 0)
                }
            };
        });
        return merged
    }
    async getOne(id) {
        return await model.findByPk(id, {
            include: [{
                model: umodel,
                as: 'addresses',
            }, {
                model: cmodel,
                as: 'finances',

                include: [{
                    model: zmodel,
                    as: 'comments',
                    include: [
                        {
                            model: smodel,
                            as: 'user',
                            attributes: ['id', 'name', 'picture', 'role'],
                            required: true
                        }
                    ],
                }, {
                    model: smodel,
                    as: 'responsible'
                }]
            }],
            order: [[{ model: cmodel, as: 'finances' }, { model: zmodel, as: 'comments' }, 'createdAt', 'DESC']]
        })
    }
    async getTotal(id) {
        const customer = await model.findByPk(id)
        const finance = await cmodel.findAll({
            where: { customer_id: customer.id },
            attributes: [
                'customer_id',
                [fn('COUNT', col('id')), 'totalItems'],
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue']
            ],
            group: ['customer_id'],
            raw: true
        });
        console.log(finance)
        return {
            ...customer.toJSON(),
            finances: [{
                totalItems: Number(finance[0].totalItems || 0),
                totalAmount: Number(finance[0].totalAmount || 0),
                totalPaid: Number(finance[0].totalPaid || 0),
                totalDue: Number(finance[0].totalDue || 0)
            }]
        };
    }
    async create(customer) {
        return await model.create(customer);
    }
    async reporting(customer) {
        return await model.upsert(customer);
    }
    async update(id, customer) {
        return await model.update(customer, { where: { id: id } })
    }
    async delete(id) {
        return await model.destroy({ where: { id: id } })
    }
}