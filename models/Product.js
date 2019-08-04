const mongoose = require('mongoose');
// var Float = require('mongoose-float').loadType(÷mongoose, 4);

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const ProductSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    
    weight: {
        type: String,
        default: ""
    },
    dimension: {
        type: String,
        default: ""
    },
    
    sellingPrice: {
        type: Number
       
    },
    image: {
        type: String,
        required: true
    },
    userId: String
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;