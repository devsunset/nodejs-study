const passport = require("passport")
const BasicStrategy = require('passport-http').BasicStrategy
const User = require('../models/user')

passport.use(new BasicStrategy(
    function(Username, Password, done) {      
     User.findOne({user_id: Username, user_pwd:Password},{user_pwd:0},(err,doc)=>{
          if(doc){
               return done(null, doc)
          }else{
               return done(null, false)
          }
      })      
    }
  ))

exports.isBasicAuthenticated = passport.authenticate('basic',{session: false})