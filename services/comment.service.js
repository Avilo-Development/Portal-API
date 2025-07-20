import { CommentsModel as model, FinanceModel as umodel, UserModel as imodel } from "../db/Models.js"

export default class CommentService {
    async create(comment) {
        return await model.create(comment)
    }
    async getAll() {
        return await model.findAll({
            include: [{
                model: umodel,
                as: 'finance',
                attributes: ['id', 'job_id', 'customer_id', 'address', 'amount', 'paid', 'due', 'job_number']
            }, {
                model: imodel,
                as: 'user',
                attributes: ['id', 'job_id', 'customer_id', 'address', 'amount', 'paid', 'due', 'job_number']
            }]
        })
    }
    async update(id, body) {
        return await model.update(body, { where: { id: id } })
    }
    async delete(id) {
        return await model.destroy({ where: { id: id } })
    }
}