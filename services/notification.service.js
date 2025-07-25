import { Op } from "sequelize";
import { NotificationModel as model, NotificationViewModel as vmodel, UserModel as umodel, CommentsModel as cmodel, FinanceModel as fmodel } from "../db/Models.js";

export default class NotificationService {

    async getUnseen(id) {
        return vmodel.findAll({
            where: { user_id: id, viewed: false },
            include: [
                {
                    model: model,
                    as: 'notification',
                    required: true,
                    include: [{
                        model: cmodel,
                        as: 'comment',
                        include: [{
                            model: umodel,
                            as: 'user',
                            attributes: ['id', 'name', 'picture'],
                            required: true
                        }, {
                            model: fmodel,
                            as: 'finance',
                            required: true
                        }],
                    }],
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async create({ message, comment_id, user_id }) {
        const users = await umodel.findAll({
            where: {
                [Op.and]: {
                    id: { [Op.ne]: user_id },
                    verified: true,
                }
            },
            attributes: ['id'],
            raw: true
        })
        const notification = await model.create({
            message,
            comment_id
        })
        const views = users.map((user) => ({
            notification_id: notification.id,
            user_id: user.id,
            viewed: false,
            viewed_at: null
        }))
        await vmodel.bulkCreate(views);
        return notification;
    }

    async update(id, user_id) {
        const notification = await vmodel.update(
            { viewed: true, viewed_at: new Date() },
            { where: { id, user_id } }
        );
        return notification
    }

    async delete(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            return this.notifications.splice(index, 1)[0];
        }
        throw new Error('Notification not found');
    }
}