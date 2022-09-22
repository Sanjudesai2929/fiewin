const router = require("express").Router();
const auth= require("../middleware/auth")
const {
userWinSaved,userWinDataSaved,ProbilitySaved,MoreFastParitySaved, WalletAmountSaved,userOrderSaved
} = require("../controllers/Main.controller")

router.post("/userwin",  userWinSaved);
router.get("/user_win",  userWinDataSaved);
router.get("/probability",auth,  ProbilitySaved);
router.get("/more/fastparity",auth,  MoreFastParitySaved);
router.get("/walletAmount/:id",auth,  WalletAmountSaved);
router.get("/userOrder/:id",auth,  userOrderSaved);


// router.post("/Login",  LoginSaved);

module.exports = router;