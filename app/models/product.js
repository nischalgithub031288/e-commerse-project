const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const productSchema = new Schema({
    productname: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 125

    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 125
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        required: true,
        minimum: 1

    },
    stock: {
        type: Number,
        required: true,
        minimum: 0,
    },

    codEligible: {
        type: Boolean,

    },
    imageUrl: {
        type: String
    }


})
const Product = mongoose.model('Product', productSchema)

module.exports = {
    Product
}





