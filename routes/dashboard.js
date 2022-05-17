const express = require("express")
const router = express.Router();
const moment = require("moment")
const chanelModel = require("../database/models/chandelModel.js");
const userModel = require("../database/models/usersdata.js");
const chanelPostModel = require("../database/models/chanelPost.js");

let arr=[];
router.get("/dashboardpage",(req, res)=>{
    chanelModel.find().distinct("username").then(user=>{
        for(let i=0;i<user.length;i++){
            arr.push(user[i]);
        }
        console.log(arr)
    })
    res.render("./dashbaord/dashbaordpage.ejs")
})


module.exports = router