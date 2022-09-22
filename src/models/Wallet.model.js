const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('@mongoosejs/double');
const WalletSchema = new mongoose.Schema({
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.000
    },
    userId: {
        type: String,

    },

}

)



module.exports = mongoose.model('Wallet', WalletSchema);