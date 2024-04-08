const mongoose = require("mongoose");

const userProductsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Please provide the user id"],
        ref: 'user'
    },
    products: [{
        _id: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide the product id"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please enter the product name"],
        },
        price: {
            type: String,
            required: [true, "Please enter the price of the product"]
        }
    }]
});

const UserProducts = mongoose.model('userProduct', userProductsSchema);

module.exports = UserProducts;