import { CommentsModel as model, FinanceModel as umodel, UserModel as imodel, NotificationViewModel as nvmodel, NotificationModel as nmodel } from "../db/Models.js"
import NotificationService from "./notification.service.js"
export default class CommentService {
    constructor(){
        this.notificationService = new NotificationService()
    }
    async create(comment) {
        try{
            const result =  await model.create(comment)
            const message = `New comment on ${new Date(result.createdAt).toLocaleDateString()}`
            console.log(message)

            await this.notificationService.create({user_id: result.created_by, message, comment_id: result.id})

            return result
        } catch (error) {
            throw Error(error);
        }
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
            }],
            order: [['createdAt', 'DESC']]
        })
    }
    async update(id, body) {
        return await model.update(body, { where: { id: id } })
    }
    async delete(id) {
        const notify = await nmodel.findOne({ where: { comment_id: id } })
        await nvmodel.destroy({ where: { notification_id: notify.id } })
        await nmodel.destroy({ where: { comment_id: id } })
        return await model.destroy({ where: { id: id } })
    }
}