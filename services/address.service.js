import {AddressModel as model} from '../db/Models.js'

export default class AddressService{
    async getAll(){
        return await model.findAll()
    }
    async get(id){
        return await model.findOne({where: {id:id}})
    }
    async create(customer){
        return await model.create(customer);
    }
    async update(id, customer){
        return await model.update(customer, {where: {id: id}})
    }
    async delete(id){
        return await model.destroy({where: {id:id}})
    }
}