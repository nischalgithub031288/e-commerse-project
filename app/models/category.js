const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const categorySchema = new Schema({
    categoryname: {
        type: String,
        required: true,
        minlength: 5
    }



})

const Category = mongoose.model('Category', categorySchema)

module.exports = {
    Category
}

