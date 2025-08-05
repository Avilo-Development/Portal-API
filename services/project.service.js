import {ProjectModel as model, UserModel as umodel} from '../db/Models.js'

export default class ProjectService{
    async getAll(){
        return await model.findAll({
            include: [{
                model:umodel,
                as: 'users',
                attributes: ['id','name','role']
            }]
        })
    }
    async get(id){
        return await model.findOne({where: {id:id}})
    }
    async create(project){
        return await model.create(project);
    }
    async update(id, project){
        return await model.update(project, {where: {id: id}})
    }
    async delete(id){
        return await model.destroy({where: {id:id}})
    }
}