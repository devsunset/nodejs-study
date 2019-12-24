import httpStatus from 'http-status'
import createError from 'http-errors'
import userRepo from '../repositories/user.repository'
const utils = require('../utils/utils')
import response from '../utils/response'

const createUserAdmin = async (req, res, next) => {
    try {
         return response(res, {message: 'create userAdmin'})       
    } catch (e) {
        next(e)
    }
}
  
//const readUserAdmin = (req, res) => res.json({
//    message: 'read userAdmin'
//})
const readUserAdmin = async (req, res, next) => {
    try {
        if (req.query.uuid) {
            const user = await userRepo.find(req.query.uuid)

            if (!user) {
                throw (createError(httpStatus.NOT_FOUND, '사용자를 찾을 수 없습니다.'))
            }

           return response(res, users)

        } else {
            const users = await userRepo.all()

           return response(res, users)
        }
    } catch (e) {
        next(e)
    }
}

const updateUserAdmin =  async (req, res, next) => {
    try {
         return response(res, {message: 'update userAdmin'})       
    } catch (e) {
        next(e)
    }
}

const deleteUserAdmin = async (req, res, next) => {
    try {
         return response(res, {message: 'delete userAdmin'})       
    } catch (e) {
        next(e)
    }
}

export {
    createUserAdmin
    ,readUserAdmin
    ,updateUserAdmin
    ,deleteUserAdmin
}