const jwt = require('jsonwebtoken')

const authJwtCheck = (req, res, next) => {

    const token = req.headers['x-access_token'] || req.query.access_token || req.body.access_token

    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'no setting access_token'
        })
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('secret_key'), (err, tokenInfo) => {
                if(err) reject(err)
                resolve(tokenInfo)
            })
        }
    )

    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    p.then((tokenInfo)=>{
        req.tokenInfo = tokenInfo
        console.log('---------------------')
        console.log(req.tokenInfo)
        console.log('---------------------')
        next()
    }).catch(onError)
}

module.exports = authJwtCheck