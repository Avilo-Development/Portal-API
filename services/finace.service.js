import { FinanceModel as model, UserModel as umodel, CommentsModel as cmodel, CustomerModel as smodel, AddressModel as zmodel } from "../db/Models.js";
import { Op } from '@sequelize/core';
import { fn, col, literal } from 'sequelize';

const config = ({ page_size, order_by, order, page }) => {
    const offset = (page) * page_size
    return {
        limit: parseInt(page_size),
        offset: offset,
        order: [[order_by, order], [{ model: cmodel, as: 'comments' }, 'createdAt', 'DESC']],
    }
}
const return_page = ({ result, page_size, page }) => {
    const total_items = result.count
    const total_pages = Math.ceil(total_items / page_size);

    return {
        total_items,
        total_pages,
        page,
        page_size,
        data: result.rows
    }
}
export default class FinanceService {
    async getAll(query) {
        let _last = new Date(query.date || '2025-01-01')
        _last.setFullYear(_last.getFullYear() + 1)
        _last = _last.toLocaleDateString('en-CA')
        const result = await model.findAll({
            where: {
                invoice_date: {
                    [Op.gte]: query.date || '2025-01-01',
                    [Op.lte]: _last
                }
            },
            distinct: true,
            subQuery: false,
            include: [{
                model: umodel,
                as: 'responsible',
                attributes: ['id', 'name', 'role', 'email']
            }, {
                model: cmodel,
                as: 'comments',
                include: [{
                    model: umodel,
                    as: 'user',
                    attributes: ['id', 'name', 'picture', 'role'],
                    required: false
                }],
            }, {
                model: smodel,
                as: 'customer',
                include: [{
                    model: zmodel,
                    as: 'addresses',
                    required: false
                }]
            },],
            order: [[query?.order_by || 'overdue', query?.order || 'DESC'], [{ model: cmodel, as: 'comments' }, 'createdAt', 'ASC']],
        })
        return result
    }
    async getGrouped(date) {
        let _last = new Date(date)
        _last.setFullYear(_last.getFullYear() + 1)
        _last = _last.toLocaleDateString('en-CA')
        return await model.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('invoice_date'), '%Y-%m'), 'month'],
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue']
            ],
            where: {
                invoice_date: {
                    [Op.gte]: date,
                    [Op.lte]: _last
                }
            },
            group: [literal('month')],
            order: [[literal('month'), 'ASC']],
            raw: true
        })
    }
    async getTotal(date) {
        const _date = new Date(date).toLocaleDateString('en-CA')
        const _last = new Date(date)
        _last.setFullYear(_last.getFullYear() + 1)
        const _last_date = _last.toLocaleDateString('en-CA')
        return await model.findAll({
            attributes: [
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue'],
            ],
            where: {
                invoice_date: {
                    [Op.gte]: _date,
                    [Op.lte]: _last_date
                }
            },
            raw: true,
        })
    }
    async getByResponsible({ responsible, query }) {
        let _last = new Date(query?.date || '2025-01-01')
        if (query?.filter === 'year') { _last.setFullYear(_last.getFullYear() + 1) }
        if (query?.filter === 'month') { _last.setMonth(_last.getMonth() + 1) }
        if (query?.filter === 'day') { _last.setMonth(_last.getDay() + 1) }
        _last = _last.toLocaleDateString('en-CA')
        if (responsible === 'null') responsible = null
        const data = await model.findAll({
            where: {
                [Op.and]: [
                    { responsible_id: responsible },
                    {
                        job_date: {
                            [Op.gte]: query.date || '2025-01-01',
                            [Op.lte]: _last
                        }
                    }
                ]
            },
            include: [{
                model: umodel,
                as: 'responsible',
                attributes: ['id', 'name', 'role', 'email']
            }, {
                model: cmodel,
                as: 'comments',
                include: [{
                    model: umodel,
                    as: 'user',
                    attributes: ['id', 'name', 'picture', 'role'],
                },],
                order: [['createdAt', 'DESC']]
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }],
            order: [[query?.order_by || 'overdue', query?.order || 'DESC'], [{ model: cmodel, as: 'comments' }, 'createdAt', 'ASC']],
        })
        const totals = await model.findAll({
            where: {
                [Op.and]: [
                    { responsible_id: responsible },
                    {
                        invoice_date: {
                            [Op.gte]: query.date || '2025-01-01',
                            [Op.lte]: _last
                        }
                    }
                ]
            },
            attributes: [
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue'],
            ],
        })
        return { data, ...totals }
    }
    async getByInvoiceStatus({ status, query }) {
        const date = parseInt(status)

        const where = () => {
            if (date === 0) return { [Op.and]: [{ overdue: 0 }, { due: 0 }] }
            if (date === 1) return { overdue: { [Op.gt]: 0 } }
            if (date < 0) return { overdue: -1 }
            if (date === 2) return { [Op.and]: [{ overdue: { [Op.gt]: 0 } }, { overdue: { [Op.lte]: 30 } }] }
            if (date === 30) return { [Op.and]: [{ overdue: { [Op.gte]: date } }, { overdue: { [Op.lte]: 60 } }] }
            if (date === 60) return { [Op.and]: [{ overdue: { [Op.gte]: date } }, { overdue: { [Op.lte]: 90 } }] }
            if (date === 90) return { overdue: { [Op.gte]: date } }
        }

        const data = await model.findAll({
            where: where(),
            include: [{
                model: umodel,
                as: 'responsible',
                attributes: ['id', 'name', 'role', 'email']
            }, {
                model: cmodel,
                as: 'comments',
                include: [{
                    model: umodel,
                    as: 'user',
                    attributes: ['id', 'name', 'picture', 'role'],
                }],
                order: [['createdAt', 'DESC']]
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }],
            order: [[query?.order_by || 'job_date', query?.order || 'DESC'], [{ model: cmodel, as: 'comments' }, 'createdAt', 'ASC']],
        })
        const totals = await model.findAll({
            where: where(),
            attributes: [
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue'],
            ],
        })
        return { data, ...totals }
    }
    async getOne(id) {
        return await model.findOne({
            where: {
                [Op.or]: [
                    { id: id },
                    { job_number: id },
                    { job_id: id }
                ]
            },
            include: [{
                model: umodel,
                as: 'responsible',
                attributes: ['id', 'name', 'role', 'email']
            }, {
                model: cmodel,
                as: 'comments',
                attributes: ['id', 'created_by', 'text', 'status', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: umodel,
                        as: 'user',
                        attributes: ['id', 'name', 'picture', 'role'],
                        required: true
                    }
                ],
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }],
            order: [[{ model: cmodel, as: 'comments' }, 'createdAt', 'ASC']]
        })
    }
    async getByPK(id) {
        return await model.findByPk(id, {
            include: [{
                model: umodel,
                as: 'responsible',
                attributes: ['id', 'name', 'role', 'email']
            }, {
                model: cmodel,
                as: 'comments',
                attributes: ['id', 'created_by', 'text', 'status', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: umodel,
                        as: 'user',
                        attributes: ['id', 'name', 'picture', 'role'],
                        required: true
                    }
                ],
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }],
            order: [[{ model: cmodel, as: 'comments' }, 'createdAt', 'ASC']]
        })
    }
    async update(id, body) {
        return await model.update(body, { where: { id: id } })
    }
    async create(finance) {
        return await model.create(finance)
    }
    async reporting(finance) {
        return await model.upsert(finance)
    }
    // async addInvoice(invocie) {
    //     return await imodel.create(invocie)
    // }
}