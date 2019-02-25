const express = require('express')
const router = express()
const { User } = require('../models/user')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')

router.use(express.json())

// function authorization(req, res, next) {
//     const

// }

router.get('/', authenticate, authorization, (req, res) => {


    User.find()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            res.send(err)
        })
})
// router.post('/', (req, res) => {
//     const body = req.body
//     const user = new User(body)
//     user.save()
//         .then((user) => {
//             res.send(user)
//         })
//         .catch((err) => {
//             res.send(err)
//         })
// })

router.get('/:id', authenticate, (req, res) => {
    const _id = req.params.id
    User.findOne({ _id })
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put('/:id', authenticate, (req, res) => {
    const _id = req.params.id
    const body = req.body
    User.findOneAndUpdate({ _id }, { $set: body })
        .then((user) => {
            res.send({
                notice: 'updated Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send((err))
        })
})

router.post('/register', (req, res) => {
    const body = req.body
    const user = new User(body)
    user.save()
        .then((user) => {
            res.send({
                user,
                notice: 'successful registerd'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/login', (req, res) => {
    const body = req.body

    User.findByEmailAndPassword(body.email, body.password)
        .then((user) => {
            return user.generateToken()    //generate the token for user after login //2 if promise resolve then send token in 64 line

        })
        .then((token) => {
            //we want to set the token in header not in body
            //whenever we request it is not available in body token will show in header
            //res.send(token)
            res.header('x-auth', token).send()

            //when the token is send to the client
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })

    //token is sucessfully created
})









module.exports = {
    usersRouter: router
}