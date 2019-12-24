import {models} from '../models/index'

export default {
  // CREATE
  store: async (data) => await models.User.create(data),

  // READ
  all: async () => await models.User.findAll({attributes: ['uuid','email','createdAt','updatedAt']}),


  find: async (uuid) => {
    return await models.User.findOne({
      attributes: ['uuid','email','createdAt','updatedAt'],
      where: {
        uuid: Buffer(uuid, 'hex')
      }
    })
  },
  
  findById: async (id) => await models.User.findByPk(id)
  
  // UPDATE
  // DELETE
}