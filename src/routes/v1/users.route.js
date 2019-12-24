import express from 'express'

const jwt = require('jsonwebtoken')
const router = express.Router()

const auth = require('../../auth/auth')
const authJwtCheck = require('../../auth/authJwtCheck')
const user = require('../../controller/user')
//const userAdmin = require('../../controller/userAdmin')
import * as userAdmin from '../../controller/userAdmin'

//BASIC AUTHENTICATED
    /*
    router.route('/user')
    .post(user.createUser)
    .get(auth.isBasicAuthenticated,user.readUser)
    .put(auth.isBasicAuthenticated,user.updateUser)
    .delete(auth.isBasicAuthenticated,user.deleteUser)
    */

router.route('/user')
    .post(user.createUser)
    .get(user.readUser)
    .put(user.updateUser)
    .delete(user.deleteUser)


//JWT
router.route('/login')
.get((req,res) =>{
    console.log(req.app.get('secret_key'))

    let token = jwt.sign({
        user_id: "admin",
        email: "admin@example.com"  
    },
    req.app.get('secret_key'),    
    {
        expiresIn: '5m'    
    })

    //res.cookie("authToken", token)
    res.send("Logined : access-token :  "+token)
})

//USE JWT
//router.use('/userAdmin', authJwtCheck)

router.route('/userAdmin')
    .post(userAdmin.createUserAdmin)
    .get(userAdmin.readUserAdmin)
    .put(userAdmin.updateUserAdmin)
    .delete(userAdmin.deleteUserAdmin)

export default router
