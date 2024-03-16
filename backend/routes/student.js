const express= require('express');
const { register, login, getAllStudents, logout, forgotPassword, resetPassword, deleteUser, updateUser } = require('../controllers/student');
const router= new express.Router() ;
const auth= require("../middlewares/student")

router.post("/register",register);
router.post("/login",login)
router.delete("/logout",logout)
router.post("/forgotPassword",forgotPassword)
router.post("/resetPassword/:resetToken",resetPassword)
router.get("/", getAllStudents)
router.delete("/deleteUser/:email",deleteUser)
router.patch("/updateUser",updateUser)
module.exports= router