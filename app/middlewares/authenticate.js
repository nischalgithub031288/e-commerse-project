const { User } = require('../models/user')

function authenticate(req, res, next) {
    const token = req.header('x-auth')
    //console.log('1', token)
    if (token) {
        //console.log('2', token)
        User.findByToken(token)

            .then((user) => {
                console.log('inside authenticate', user)
                req.user = user
                req.token = token
                req.role = user.role
                next()
            })
            .catch((err) => {

                res.send(err)
                //console.log('err of my logo')
            })
    } else {
        res.send('token not provided')
    }
}

module.exports = {
    authenticate
}