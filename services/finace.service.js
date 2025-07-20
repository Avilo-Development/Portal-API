import { FinanceModel as model, UserModel as umodel, CommentsModel as cmodel, CustomerModel as smodel, AddressModel as zmodel } from "../db/Models.js";
import { Op } from '@sequelize/core';
import { fn, col, literal } from 'sequelize';

const config = ({ page_size, order_by, order, page }) => {
    const offset = (page - 1) * page_size
    return {
        limit: parseInt(page_size),
        offset: parseInt(offset),
        order: [[order_by, order]],
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
    async getAll({ order = 'DESC', page_size = 50, page = 1, order_by = 'job_date' }) {

        const result = await model.findAndCountAll({
            ...config({ page_size, order_by, order, page }),
            where: { amount: { [Op.gt]: 0 } },
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
                }]
            }, {
                model: smodel,
                as: 'customer',
                include: [{
                    model: zmodel,
                    as: 'addresses',
                }]
            },]
        })

        return return_page({ result, page_size, page })
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
    async getByResponsible(responsible) {
        const data = await model.findAll({
            where: { responsible_id: responsible },
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
                },]
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }]
        })
        const totals = await model.findAll({
            where: { responsible_id: responsible },
            attributes: [
                [fn('SUM', col('amount')), 'totalAmount'],
                [fn('SUM', col('paid')), 'totalPaid'],
                [fn('SUM', col('due')), 'totalDue'],
            ],
        })
        return { data, ...totals }
    }
    async getByInvoiceStatus(sent) {
        const status = sent === 'true'
        const data = await model.findAll({
            where: {
                invoice_date: status ? {
                    [Op.ne]: null
                } : null
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
                }]
            }, {
                    model: smodel,
                    as: 'customer',
                    include: {
                        model: zmodel,
                        as: 'addresses'
                    }
                }]
        })
        const totals = await model.findAll({
            where: {
                invoice_date: status ? {
                    [Op.ne]: null
                } : null
            },
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
                attributes: ['id', 'created_by', 'text', 'status', 'createdAt', 'updatedAt']
            }, {
                model: smodel,
                as: 'customer',
                include: {
                    model: zmodel,
                    as: 'addresses'
                }
            }]
        })
    }
    async update(id, body) {
        return await model.update(body, { where: { id: id } })
    }
    async create(finance) {
        return await model.create(finance)
    }
    // async addInvoice(invocie) {
    //     return await imodel.create(invocie)
    // }
}