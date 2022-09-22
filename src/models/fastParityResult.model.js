const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const fastParityresultSchema = new mongoose.Schema({
    period: {
        type: String,

    },
    winuser: {
        type: Array,

    },
    win_number: {
        color: Array,
        number: Array
    },
    totalPrice: {
        type: String,
    },
    date: {
        type: String,
        default: Date.parse(new Date())
    }
}
)



module.exports = mongoose.model('fastParityResult', fastParityresultSchema);