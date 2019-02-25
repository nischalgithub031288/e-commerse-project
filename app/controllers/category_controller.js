const express = require('express')
const router = express()
const { Category } = require('../models/category')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')
router.use(express.json())

router.get('/', authenticate, authorization, (req, res) => {


    Category.find()
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/', authenticate, authorization, (req, res) => {
    const body = req.body
    const category = new Category(body)
    category.save()
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send(err)
        })
})

// router.get('/:id', (req, res) => {
//     const id = req.params.id
//     Category.findById(id)
//         .then((category) => {
//             res.send(category)
//         })
//         .catch((err) => {
//             res.send((err))
//         })
// })

router.get('/:id', (req, res) => {
    const id = req.params.id
    Category.findById(id)
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send((err))
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Category.findByIdAndDelete(id)
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send((err))
        })
})






module.exports = {
    categoryRouter: router
}
