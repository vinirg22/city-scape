const mongoose = require('mongoose');
// var Float = require('mongoose-float').loadType(÷mongoose, 4);

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;