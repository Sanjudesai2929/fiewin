const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var nodejsUniqueNumericIdGenerator = require("nodejs-unique-numeric-id-generator")

const userWinSchema = new mongoose.Schema({
    avtar: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""

    },
    win_amount: {
        type: String,
        default: ""
    },
    game_name: {
        type: String,
        default: ""
    },
    currency: {
        type: String,
        default: ""
    },
    mobile_no: {
        type: String,
        default: ""
    }
}
)

module.exports = mongoose.model('userWin', userWinSchema);