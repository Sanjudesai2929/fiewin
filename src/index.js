const express = require("express");
const app = express();
const http = require("http")
require('./db/conn');
const cors = require("cors");
const userWinModel = require("../src/models/userWin.model")
const FastParityModel = require("./models/FastParity.model");
const session = require("express-session");
const RegisterModel = require("./models/Register.model");
app.use(cors())
const { Server } = require("socket.io")
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
var server = http.createServer(app)

var io = new Server(server, {
    cors: {
        origin: "*"
    },

})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRouter = require("./routes/Auth.routes");
app.use('/api', authRouter)
const mainRouter = require("./routes/Main.routes");
const fastParityResultModel = require("./models/fastParityResult.model");
const WalletModel = require("./models/Wallet.model");
app.use('/api', mainRouter)

const year = new Date().getFullYear().toString().slice(-2);
const month = ("0" + (new Date().getMonth() + 1)).toString().slice(-2)
const day = String(new Date().getDate()).padStart(2, '0');
const fullDate = year + month + day
const index = "0"


io.on("connection", async (socket) => {
    // const req = socket.request;
console.log("connection",socket.id);
    socket.on("loginid", async (data) => {
        // console.log("loginid ", data);
        // const wallet_amount = await WalletModel.find({ userId: data })
        // socket.emit("wallet_amount", wallet_amount[0])

    })
    const userWinData = await userWinModel.find()
    socket.emit("user-win", userWinData)

    const period_number = await fastParityResultModel.find().sort({ _id: -1 }).limit(1)

    const period = period_number.length && period_number[0].period.slice(6)
    const period1 = period_number.length && period_number[0].period.slice(0, 6)

    if (period_number.length) {
        socket.emit("period_number1", period1 + (Number(period) + 1))
        socket.broadcast.emit("period_number1", period1 + (Number(period) + 1))
    }
    else {
        socket.emit("period_number1", fullDate + (Number(index) + 1))
        socket.broadcast.emit("period_number1", fullDate + (Number(index) + 1))
    }

    // const year = new Date().getFullYear().toString().slice(-2);
    // const month = ("0" + (new Date().getMonth() + 1)).toString().slice(-2)
    // const day = String(new Date().getDate()).padStart(2, '0');
    // var i = "0"

    // const date = year + month + day
    // setInterval(() => i++, 30000); console.log(date + i);
    // socket.emit("period_number", date + i)



    socket.on("join_fast_parity", async (data) => {
        const { period, user, select_number, point, Amount } = data
        const amount_of_user = await WalletModel.find({ userId: user })
        if (amount_of_user[0].amount < point) {
            socket.emit("balance_low", "balance low ")
        }
        else {
            await WalletModel.updateMany({ userId: user }, { amount: amount_of_user[0].amount - point })
            var value
            if (select_number == "Green" || select_number == "Violet" || select_number == "Red") {
                value = "color"
            }
            else {
                value = "number"
            }
            const data1 = await RegisterModel.find({ mobile_no: user })

            const finaldata = new FastParityModel({ period, value, user, select_number: select_number[0], point, Amount, avtar: data1[0] ? data1[0].avtar : "" })
            const saveData = await finaldata.save();
            const fastParityData = await FastParityModel.find().sort({ _id: -1 })
            const final = [finaldata]

            socket.emit("fast_parity_data", fastParityData)
            socket.broadcast.emit("fast_parity_data", fastParityData)
        }
    })
    const fastParityData = await FastParityModel.find().sort({ _id: -1 })
    socket.emit("fast_parity_data", fastParityData)
    socket.broadcast.emit("fast_parity_data", fastParityData)

    //FastParity1
    var itimer
    var num
    var date_check
    async function startTimer(duration) {
        var timer = duration, minutes, seconds;

        var countdownTimer = setInterval(async function () {
            seconds = parseInt(timer % 30, 10);
            seconds = seconds < 10 ? "0" + seconds : seconds;
            if (--timer < 0) {
                timer = duration;
            }
            itimer = seconds
            socket.emit("countdown", seconds)
            socket.broadcast.emit("countdown", seconds)

            if (itimer == 03) {

                // socket.on("check_result", async (data) => {

                const period_number = await fastParityResultModel.find().sort({ _id: -1 }).limit(1)

                const period = period_number.length && period_number[0].period.slice(6)
                const period1 = period_number.length && period_number[0].period.slice(0, 6)
                if (period_number.length) {
                    num = Number(period) + 1
                    date_check = period1

                }
                else {
                    num = Number(index) + 1
                    date_check = fullDate

                }
                console.log("check result of:" + date_check + num);
                var color_user = []
                var number_user = []
                const result = await FastParityModel.find({ period: date_check + num })

                setTimeout(async () => {

                    if (result.length) {


                        result.map((data) => {
                            if (data.value == "color") {
                                color_user.push(data)
                            }
                            else {
                                number_user.push(data)
                            }
                        })
                        //color
                        const obj = color_user.reduce((val, cur) => {
                            val[cur.select_number] = val[cur.select_number] ? val[cur.select_number] + 1 : 1;
                            return val;
                        }, {});

                        const response = Object.keys(obj).map((key) => ({
                            select_number: key,
                            count: obj[key]
                        }));

                        var color_res = response.length && response.reduce(function (prev, current) {
                            return (prev.count < current.count) ? prev : current
                        })


                        //number
                        const obj1 = number_user.reduce((val, cur) => {
                            val[cur.select_number] = val[cur.select_number] ? val[cur.select_number] + 1 : 1;
                            return val;
                        }, {});

                        const response1 = Object.keys(obj1).map((key) => ({
                            select_number: key,
                            count: obj1[key]
                        }));
                        var number_res = response1.length && response1.reduce(function (prev, current) {
                            return (prev.count < current.count) ? prev : current
                        })
                 
                         const final_color=[]
                         response.map((data)=>{
                            if(data.count == color_res.count){
                                 final_color.push(data.select_number)
                            }
                         })
                      
                 
                        var res1
                        // const final = await FastParityModel.find({ $or: [{ period: result[0].period }, { $or: [{ select_number: color_res.select_number }, { select_number: number_res.select_number }] }] })
                        const final = await FastParityModel.find({ $or: [{ $and: [{ period: date_check + num, select_number:{$in: final_color}  }] }, { $and: [{ period: date_check + num, select_number: number_res.select_number }] }] })
                        console.log("winuser", final);
                        const winuserId = []
                        final.map((data) => {
                            winuserId.push(data.user)
                        })

                        if (final.length) {

                            final.map(async (data) => {
                                const value = await WalletModel.find({ userId: data.user })
                                console.log(value);
                                await WalletModel.updateMany({ userId: data.user }, { amount: Number(value[0].amount) + Number(data.Amount) })

                            })
                            const res = new fastParityResultModel({
                                period: result[0].period, winuser: winuserId,
                                win_number: { color: final_color, number: number_res.select_number }, totalPrice: ""
                            })

                            res1 = res
                            await res.save();
                        }

                        socket.emit("result_fast_parity", res1)
                        socket.broadcast.emit("result_fast_parity", res1)
                        const result_all = await fastParityResultModel.find().sort({ _id: -1 }).limit(25)
                        socket.emit("result_all_fast_parity", result_all)
                        socket.broadcast.emit("result_all_fast_parity", result_all)
                        if (date_check == fullDate) {
                            socket.emit("period_number1", date_check + (Number(num) + 1))
                            socket.broadcast.emit("period_number1", date_check + (Number(num) + 1))
                        }
                        else {
                            socket.emit("period_number1", fullDate + (Number(index) + 1))
                            socket.broadcast.emit("period_number1", fullDate + (Number(index) + 1))
                        }
                    }
                    else {

                        const res = new fastParityResultModel({
                            period: date_check + num, winuser: [],
                            win_number: { color: "", number: "" }
                        })

                        await res.save();

                        socket.emit("result_fast_parity", res)
                        socket.broadcast.emit("result_fast_parity", res)
                        const result_all = await fastParityResultModel.find().sort({ _id: -1 }).limit(25)

                        socket.emit("result_all_fast_parity", result_all)
                        socket.broadcast.emit("result_all_fast_parity", result_all)
                        if (date_check == fullDate) {
                            socket.emit("period_number1", date_check + (Number(num) + 1))
                            socket.broadcast.emit("period_number1", date_check + (Number(num) + 1))
                        }
                        else {
                            socket.emit("period_number1", fullDate + (Number(index) + 1))
                            socket.broadcast.emit("period_number1", fullDate + (Number(index) + 1))
                        }
                    }

                }, [2000])
                // })
            }
        }, 1000);
    }
    startTimer(Date.now());

    const result_all = await fastParityResultModel.find().sort({ _id: -1 }).limit(25)
    // socket.emit("period_number1", date_check + (Number(num) + 1))
    // socket.broadcast.emit("period_number1", date_check + (Number(num) + 1))
    socket.emit("result_all_fast_parity", result_all)
    socket.broadcast.emit("result_all_fast_parity", result_all)
    socket.on('disconnect', function () {
        console.log("disconnect: ", socket.id);

    });
})


server.listen(port, async () => {
    console.log("server listening on port " + port);

    // function startTimer(duration, display) {
    //     var timer = duration, minutes, seconds;
    //     setInterval(function () {
    //         // minutes = parseInt(timer / 60, 10);
    //         seconds = parseInt(timer % 10, 10);


    //         seconds = seconds < 10 ? "0" + seconds : seconds;

    //      

    //         if (--timer < 0) {
    //             timer = duration;
    //         }
    //     }, 1000);
    // }
    // startTimer(Date.now());

})  