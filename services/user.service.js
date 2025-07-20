import { hashEncode } from '../config/crypto.js';
import {FinanceModel as pmodel, UserModel as model} from '../db/Models.js'

export default class UserService{
    async getAll(){
        return await model.findAll({include: [{
            model: pmodel,
            as: 'finances',
            attributes: ['id','job_id','customer_id', 'job_number', 'address', 'amount','paid','due', 'job_date', 'createdAt']
        }]})
    }
    async get(where){
        return await model.findOne({where:where})
    }
    async create(user){
        const pass = hashEncode(user.password)
        return await model.create({...user, password: pass});
    }
    async update(id, user){
        return await model.update(user, {where: {id: id}})
    }
    async delete(id){
        return await model.destroy({where: {id:id}})
    }
}