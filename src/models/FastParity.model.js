const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const fastParitySchema = new mongoose.Schema({
    period: {
        type: String,
      
    },
    user: {
        type: String,
    },
    select_number:{
        type: String,

    },
    point:{
        type: String,
    },
    avtar:{
        type: String,

    },
    Amount:{
        type: String,

    },
    value:{
        type:String
    },
    date:{
        type: String,
        default:Date.parse(new Date())
    }
}
)



module.exports = mongoose.model('fastParity', fastParitySchema);