const ObjectId = require("mongodb").ObjectId;
const userWinModel = require("../models/userWin.model")

const FastParityModel = require("../models/FastParity.model");
const RegisterModel = require("../models/Register.model");
const fastParityResultModel = require("../models/fastParityResult.model");
const WalletModel = require("../models/Wallet.model");

// const WalletModel = require("../models/Wallet.model")




// DUMMY DATA API 
exports.userWinSaved = async (req, res) => {
    try {

        const { avtar, userId, win_amount, game_name, currency, mobile_no } = req.body
        const RegisterData = new userWinModel({
            avtar, userId, win_amount, game_name, mobile_no, currency
        });

        const saveData = await RegisterData.save();


        res.status(201).json({
            status: true,
            message: "Add successfully "
        })


    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}

exports.userWinDataSaved = async (req, res) => {
    try {

        const data = await userWinModel.find()

        res.status(201).json({
            status: true,
            data: data
        })


    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}

exports.ProbilitySaved = async (req, res) => {
    try {

        const result_all_data = await fastParityResultModel.find().sort({ _id: -1 }).limit(1)
        const result_red_data = await fastParityResultModel.find({win_number:"R"}).count()
        const result_green_data = await fastParityResultModel.find({win_number:"G"}).count()
        const result_violet_data = await fastParityResultModel.find({win_number:"V"}).count()
        const result_1_data = await fastParityResultModel.find({win_number:"1"}).count()
        const result_2_data = await fastParityResultModel.find({win_number:"2"}).count()
        const result_3_data = await fastParityResultModel.find({win_number:"3"}).count()
        const result_4_data = await fastParityResultModel.find({win_number:"4"}).count()
        const result_5_data = await fastParityResultModel.find({win_number:"5"}).count()
        const result_6_data = await fastParityResultModel.find({win_number:"6"}).count()
        const result_7_data = await fastParityResultModel.find({win_number:"7"}).count()
        const result_8_data = await fastParityResultModel.find({win_number:"8"}).count()
        const result_9_data = await fastParityResultModel.find({win_number:"9"}).count()
        const result_0_data = await fastParityResultModel.find({win_number:"0"}).count()
        res.status(201).json({
            status: true,
            data: {
                times:Number(result_all_data[0].period.slice(6)),
                Red:result_red_data,
                Green:result_green_data,
                Violet:result_violet_data,
                1:result_1_data,
                2:result_2_data,
                3:result_3_data,
                4:result_4_data,
                5:result_5_data,
                6:result_6_data,
                7:result_7_data,
                8:result_8_data,
                9:result_9_data,
                0:result_0_data
            }
        })


    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}


exports.MoreFastParitySaved = async (req, res) => {
    try {

        const data = await fastParityResultModel.find()
      console.log(data);
      const data1=data.map((data)=>{
        return {period:data.period,winNumber:data.win_number,date:data.date,price:""}
      })
        res.status(201).json({
            status: true,
            data: data1
        })


    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}
exports.WalletAmountSaved = async (req, res) => {
    try {
      const id =req.params.id
     const wallet_amount = await WalletModel.find({ userId: id })
    console.log(id);
    
        res.status(201).json({
            status: true,
            data: wallet_amount
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}

exports.userOrderSaved = async (req, res) => {
    try {
      const id =req.params.id
     const user = await FastParityModel.find({ user: id })
     var data1

     const result = await fastParityResultModel.find()
     var winnum = new Map(result.map(({win_number , period }) => ([period, win_number])));
     var winuser = new Map(result.map(({winuser , period }) => ([period, winuser])));
console.log("aa",winnum.get("22092250")?"true":"false");
     var arrayData = user.map(obj => ({obj,  winnumber:winnum.get(obj.period) ?winnum.get(obj.period):{},status:winnum.get(obj.period) ?winuser.get(obj.period)&&winuser.get(obj.period).includes(id)?"profit":"loss":"" }));
// console.log(arrayData[0].obj.period);
    data1=arrayData.map((data)=>{
        return {period:data.obj.period,select:data.obj.select_number,point:data.obj.point,win_number:data.winnumber,status:data.status,amount:!data.status == ""?data.status == "profit"?data.obj.Amount:(data.obj.point -((data.obj.point) * 0.20 / 10)).toFixed(2):""}
      })
        res.status(201).json({
            status: true,
            data: data1
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Somthing Went Wrong"
        })
    }
}





