const mongoose = require('mongoose');
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
    shippingCost: {
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