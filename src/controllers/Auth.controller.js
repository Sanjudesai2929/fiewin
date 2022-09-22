const ObjectId = require("mongodb").ObjectId;
const RegisterModel = require("../models/Register.model")
const WalletModel = require("../models/Wallet.model")

const bcrypt = require("bcrypt")
var nodejsUniqueNumericIdGenerator = require("nodejs-unique-numeric-id-generator")


exports.RegisterSaved = async (req, res) => {
  try {
    const number = await RegisterModel.find({ mobile_no: req.body.mobile_no })
   
    if (number.length) {
      res.status(201).json({
        status: false,
        message: "Number is already register"
      })
    }
    else {

      const RegisterData = new RegisterModel({
        mobile_no: req.body.mobile_no,
        password: req.body.password,
        // userId: nodejsUniqueNumericIdGenerator.generate(new Date().toJSON())
      });

      const saveData = await RegisterData.save();
      const accesstoken = await RegisterData.generateAccessToken()

      console.log(saveData);
      const WalletData = new WalletModel({
        amount: "0.000",
        userId: saveData.userId
      })
      await WalletData.save();

      res.status(201).json({
        status: true,
        message: "Register Successfully "
      })
    }

  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error
    })
  }
}
exports.LoginSaved = async (req, res) => {
  try {

    const { mobile_no, password } = req.body
    var userData = await RegisterModel.find({ mobile_no })
    if (userData) {
 
      const cofirm = await bcrypt.compare(password, userData[0].password)
      const accesstoken = await userData[0].generateAccessToken()

      if (cofirm) {
        // res.cookie("user",userData.username)
        res.json({
          status: true,
          message: "Logging Successfully",
          mobile_no: userData[0].mobile_no,
          userId: userData[0].userId,
          avtar:userData[0].avtar,
          nickName:userData[0].nickName,
          _id: userData[0]._id,
          token:accesstoken
        })
      }
      else {
        res.json({
          status: false,
          message: "Invaild username and password ! Try again"
        })
      }
    }
    else {
      res.json({
        status: false,
        message: "Username is not Exist"
      })
    }
  }
  catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "something went wrong"
    })
  }
}