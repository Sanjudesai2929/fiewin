const jwt = require("jsonwebtoken");
// const recruiterModel = require("../models/recriter.model");
require("dotenv").config();

const auth = async(req,res,next) => {
    try {
        
        var accesstoken = req.headers['x-access-token']
         console.log(accesstoken);
        const verifyUser = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_KEY);
        // const recruiter = await recruiterModel.findOne({_id:verifyUser._id});
        // console.log(recruiter);
        // req.accesstoken = accesstoken;
        // req.recruiter = recruiter;
        next();
    } catch (error) {
        res.status(401).send("Not Authoration");
    }
}

module.exports = auth;