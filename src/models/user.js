const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_id: String,
    user_pwd: String 
})

module.exports = mongoose.model('user',UserSchema)

