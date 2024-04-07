const mongoose = require("mongoose");

const tokenBlackListSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        expires: "1d",
        default: Date.now(),
    }
});

const TokenBlackList = mongoose.model('tokenBlackList', tokenBlackListSchema);

module.exports = TokenBlackList;