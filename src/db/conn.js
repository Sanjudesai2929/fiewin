const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(`${process.env.DBURL}`)
    .then(() => {
        console.log(`Database Connected`);
    })
    .catch((err) => {
       console.log(err);
    })