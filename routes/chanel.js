const express = require("express")
const router = express.Router();
const moment = require("moment")
const chanelModel = require("../database/models/chandelModel.js");
const userModel = require("../database/models/usersdata.js");
const chanelPostModel = require("../database/models/chanelPost.js");


router.get("/login", (req, res) => {
    res.redirect("/");
})

router.get("/verifyornot", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelModel.find({ username: req.session.username, confirm: false }).then(function (verifyornot) {
            res.json({ notverify: verifyornot })
        })
    }
    else {
        res.json({ notverify: [] })
    }
})


router.get("/totalchanel", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelModel.find({ username: req.session.username }).then(function (usersChanels) {
            res.json({ chanel: usersChanels })
        })
    }
    else {
        res.json({ chanel: [] })
    }
})

router.get("/addChanel", (req, res) => {
    res.render("./autho/dashboard.ejs", { message: "", username: "" })
})

/***************** Add new chanel ********************************* */
router.post("/addChanel", (req, res) => {
    let myTime = moment(Date.now()).format("DD MMMM  hh:mm:ss a")
    if (req.session.isLoggedIn) {
        chanelModel.create({
            chanelName: req.body.chanelName,
            chanelDescription: req.body.description,
            username: req.session.username,
            chanelTag: req.body.tag,
            member: [],
            chanelId: myTime,
        })
        res.redirect("/")
    }
    else {
        res.redirect("/")
    }
})

/****************** Find Post ******************************* */
router.get("/findPost/:id", (req, res) => {
    chanelModel.findOne({ chanelId: req.params.id }).then(function (chanel) {
        console.log(chanel, "chanel details from chanel.js line 46")
        req.session.chanelpost = chanel.chanelName
        req.session.chanelId = chanel.chanelId
        res.sendStatus(200);
    })
})
router.get("/addPost", (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("./autho/dashboard.ejs", { message: "", username: req.session.username })
    }
    else {
        res.render("./autho/login.ejs", { message: "", username: req.session.username })
    }
})
/*************************** Save post in database ************************************** */
router.post("/addPost", (req, res) => {
    if (req.session.isLoggedIn) {
        let myTime = moment(Date.now()).format("DD MMMM  hh:mm:ss a")
        chanelPostModel.create({
            username: req.session.username,
            postName: req.body.addPost,
            chanelId: req.session.chanelId,
            postChanelName: req.session.chanelpost,
            createTime: myTime,
        })
        res.render("./autho/dashboard.ejs", { username: req.session.username, message: "" });
    }
    else {
        res.redirect("/");
    }
})

/********************* Find total post aand serve to AJAX************************************** */
router.get("/totalpost/:id", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelPostModel.find({ chanelId: req.params.id }).then(function (allPost) {
            res.json({ postData: allPost })
        })
    }
    else {
        res.json({ postData: [] })
    }
})


router.get("/delete/:id", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelModel.deleteMany({ chanelId: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.sendStatus(200);
            }
        })
    }
    else {
        res.sendStatus(403);
    }
})

router.get("/addmember", (req, res) => {
    if (req.session.isLoggedIn)
        res.redirect("/");
    else
        res.render("./autho/login.ejs", { message: "" });
})

router.post("/addmember", (req, res) => {
    userModel.find({ username: req.body.addMember }).then(function (users) {
        let flag = true;
        for (let i = 0; i < users.length; i++) {
            flag = false;
            break;
        }
        if (flag === false) {
            chanelModel.find({ chanelId: req.session.chanelUniqueId, member: [req.body.addMember] }).then(function (availableUser) {
                let flags = true;
                if (availableUser.length > 0) {
                    flags = false;
                }
                if (flags === true) {
                    chanelModel.updateOne({ chanelId: req.session.chanelUniqueId }, { $push: { member: [req.body.addMember] } }, function (err) {
                        chanelModel.findOne({ chanelId: req.session.chanelUniqueId }).then(function (chanel) {
                            chanelModel.create({
                                chanelName: chanel.chanelName,
                                chanelDescription: chanel.chanelDescription,
                                username: req.body.addMember,
                                chanelTag: chanel.chanelTag,
                                member: req.session.username,
                                chanelId: req.session.chanelUniqueId,
                                confirm: false,
                                creator: false,
                            })
                            if (err) {
                                console.log(err)
                            }
                            else {
                                res.render("./autho/dashboard.ejs", { message: "Notification send to user 😎", username: req.session.username })
                            }
                        })
                    })
                }
                else {
                    res.render("./autho/dashboard.ejs", { message: "user already added in this chanel😑", username: req.session.username })
                }
            })
        }
        else {
            res.render("./autho/dashboard.ejs", { message: "user not availabe in our data🙄", username: req.session.username });
        }

    })
})

router.get("/addmember/:id", (req, res) => {
    console.log(req.params.id, "helo")
    req.session.chanelUniqueId = req.params.id;
    res.redirect("/addmember")
})


router.get("/acepetinvite/:id", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelModel.updateOne({ chanelId: req.params.id, confirm: false }, { confirm: true }, function (err) {
            chanelModel.find({ chanelId: req.params.id, username: req.session.username, confirm: true }).then(function (usersverifyChanels) {
                res.json({ chanel: usersverifyChanels })
            })
        })
    }
    else {
        res.json({ chanel: [] });
    }

})

router.get("/deleteinvite/:id", (req, res) => {
    if (req.session.isLoggedIn) {
        chanelModel.deleteOne({ chanelId: req.params.id, username: req.session.username }, (err) => {
            chanelModel.findOne({ chanelId: req.params.id, creator: true }).then(function (alllist) {
                console.log(alllist.member[0],"hii")
                /*****************remaining****************** */
                // chanelModel.remove({member:alllist.member[0]},(err)=>{
                //     if(err)
                //     console.log(err)
                // })
                res.json({ declineUSer: alllist }) 
            })
        })
    }
    else {
        res.json({ declineUSer: [] });
    }
})

/****************** DeletePost Complete***************************** */
router.get("/deletepost/:id", (req, res) => {
    console.log(req.params.id)
    chanelPostModel.deleteMany({
        postChanelName
            : req.params.id, username: req.session.username
    }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.sendStatus(200);
        }
    })
})


let postIdFormessage;
router.get("/message/:id", (req, res) => {
    console.log(req.params.id, "hello")
    postIdFormessage = req.params.id;
    if (req.session.isLoggedIn) {
        chanelPostModel.findOne({ createTime: req.params.id }).then(function (totalPost) {
            chanelModel.find({ chanelId: totalPost.chanelId, username: req.session.username }).then(function (totalMember) {
                for (let i = 0; i < totalMember.length; i++) {
                    req.session.totalMember = totalMember[i].member
                }
                req.session.postname = totalPost.postChanelName;
                req.session.postId = req.params.id;
                req.session.postTopic = totalPost.postName
                res.sendStatus(202)
            })
        })
    }
    else {
        res.redirect("/")
    }
})
router.get("/message", (req, res) => {
    if (req.session.isLoggedIn)
        res.render("./chanel/message.ejs", { message: req.session.postname, topic: req.session.postTopic, totalmembers: req.session.totalMember, username: req.session.username });
    else
        res.render("./autho/login.ejs", { message: "" })
})


router.get("/userdetails", (req, res) => {
    let myTime = moment(Date.now()).format("hh:mm:ss a")
    if (req.session.isLoggedIn)
        res.json({ userdata: req.session.username, time: myTime, postIdFormessages: postIdFormessage })
    else
        res.json({ userdata: [] })
})
router.get("/search",(req, res)=>{
    if(req.session.isLoggedIn){
        res.redirect("/search")
    }
})
router.get("/getallpost",(req, res)=>{
    chanelPostModel.find({username:req.session.username}).then(function(postdata){
        res.json({ postdata: postdata })
    })
})
// function searchresult(){
//     chanelPostModel.find({}).then(function(postdata){
//                 for(let i = 0;i<postdata.length;i++){
//                      if(req.body.searchpost === postdata[i].postName){
//                          console.log(postdata[i].postName)
//                      }
//                  }
//              })
// }
module.exports = router