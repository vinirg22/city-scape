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

ProductSchema.pre('save', function(callback) {
    let product = this;
  
    // Break out if the password hasn't changed
    if (!product.isModified('product')) return callback();
  
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
      if (err) return callback(err);
  
      bcrypt.hash(product.productId, salt, null, function(err, hash) {
        if (err) return callback(err);
        product.productId = hash;
        callback();
      });
    });
  });  

const Product = mongoose.model('Poduct', ProductSchema);

module.exports = Product;