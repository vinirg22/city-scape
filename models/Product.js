const mongoose = require('mongoose');
// var Float = require('mongoose-float').loadType(÷mongoose, 4);

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const ProductSchema = new Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    basePrice: {
        type: Number
      
    },
    price: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number
       
    },
    image: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;