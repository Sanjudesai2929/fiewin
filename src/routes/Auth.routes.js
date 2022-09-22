const router = require("express").Router();

const {
    RegisterSaved,LoginSaved
} = require("../controllers/Auth.controller")

router.post("/register",  RegisterSaved);
router.post("/Login",  LoginSaved);


module.exports = router;