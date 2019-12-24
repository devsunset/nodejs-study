const crypto = require('crypto')
const utils = require('../utils/utils')
const User = require('../models/user')
import response from '../utils/response'

exports.createUser = function(req, res,next){
    let param = utils.getParamsObj(req)
    
    let user_id = param.user_id//  req.body.user_id
    let user_pwd = param.user_pwd// req.body.user_pwd

    console.log('user_id : '+user_id +'   user_pwd : '+user_pwd)

    const hash = crypto.createHash('sha256')
    hash.update(user_pwd)
    let hash_user_pwd = hash.digest('hex')
    console.log('hash_user_pwd : '+hash_user_pwd)

    const cipher = crypto.createCipher('aes-256-cbc', req.app.get('secret_key'))
    let encrypted = cipher.update(user_pwd, 'utf8', 'base64')
    encrypted += cipher.final('base64') 
    console.log('encrypted : '+encrypted)

    const decipher = crypto.createDecipher('aes-256-cbc', req.app.get('secret_key'))
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    console.log('decrypted : '+decrypted)

    new User({user_id: user_id, user_pwd:user_pwd}).save((err,doc)=>{
        if(doc){
            console.log(doc)
            try {
               return response(res, {message: 'create user'})       
            } catch (e) {
                 next(e)
            }
        }
    })   
}

exports.readUser = function(req, res, next){    
    try {
        return response(res, {message: 'read user'})       
    } catch (e) {
         next(e)
    }
}
exports.updateUser = function(req, res, next){    
    try {
       return response(res, {message: 'update user'})       
    } catch (e) {
         next(e)
    }
}

exports.deleteUser = function(req, res, next){    
    try {
        return response(res, {message: 'delete user'})       
    } catch (e) {
         next(e)
    }
}