const mongoose = require('mongoose');
<<<<<<< HEAD
=======
// var Float = require('mongoose-float').loadType(÷mongoose, 4);

>>>>>>> 875468bc7df37beffc2a3a4b8cac32bb4ade9580
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const ProductSchema = new Schema({
    productId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    basePrice: {
        type: Number,
        required: true
    },
<<<<<<< HEAD
    shippingCost: {
=======
    price: {
>>>>>>> 875468bc7df37beffc2a3a4b8cac32bb4ade9580
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        reuired: true
    }
});

const Product = mongoose.model('Poduct', ProductSchema);

module.exports = Product;