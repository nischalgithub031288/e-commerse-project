const express = require('express')
const router = express()
const { Product } = require('../models/product')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')
const { upload } = require('../middlewares/fileUpload')
router.use(express.json())


router.post('/', upload.single('myImage'), (req, res) => {
    //note : name should be same when we post the image by postman
    // like myImage : choose file for image
    //and then same key which we write in product model
    const body = req.body

    const imageUrl = req.file.destination
    body.imageUrl = imageUrl.slice(1) + req.file.filename
    const product = new Product(body)
    product.save()
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})




router.get('/', authenticate, (req, res) => {

    console.log('jj')
    Product.find()
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})
router.post('/', authenticate, authorization, (req, res) => {
    const body = req.body
    const product = new Product(body)
    product.save()
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Product.findById(id)
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send((err))
        })
})
router.delete('/:id', authenticate, authorization, (req, res) => {
    const id = req.params.id
    Product.findByIdAndDelete(id)
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send((err))
        })
})

router.put('/:id', authenticate, authorization, (req, res) => {
    const _id = req.params.id
    const body = req.body
    Product.findOneAndUpdate({ _id }, { $set: body })
        .then((product) => {
            res.send({
                notice: 'updated Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})




module.exports = {
    productRouter: router
}