const express = require("express")
const router = express.Router();
const moment = require("moment")
const chanelModel = require("../database/models/chandelModel.js");
const userModel = require("../database/models/usersdata.js");
const chanelPostModel = require("../database/models/chanelPost.js");
const res = require("express/lib/response");




router.get("/backtohome",(req, res)=>{
    res.redirect("/")
})

router.get("/dashboardpage", (req, res) => {
 
    if(req.session.isLoggedIn){
        let payload = {
            users: []
        }
    
        let allUsersWithCount = {}
        let allUsers = []
        chanelPostModel.find({}, { username: 1, _id: 0 }).then(creator => {
            creator.forEach(c => {
                allUsers.push(c.username)
            })
    
            allUsers.forEach(t => {
    
                if (allUsersWithCount[t]) {
                    let earlyValue = allUsersWithCount[t]
                    allUsersWithCount[t] = ++earlyValue;
                }
                else {
                    allUsersWithCount[t] = 1;
                }
            })
    
            console.log(allUsersWithCount)
            allUsersWithCount = Object.entries(allUsersWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allUsersWithCount.length <= 5 ? allUsersWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                payload.users.push(allUsersWithCount[i])
            }
            
        })  
        /************** Tranding chanel ******************** */

        let popularchanel = {
            chanel: []
        }
        let allChanelWithCount = {}
        let allchanel = []
        chanelPostModel.find({}, { postChanelName: 1, _id: 0 }).then(chanels => {
            chanels.forEach(c => {
                allchanel.push(c.postChanelName)
            })
            allchanel.forEach(t => {
    
                if (allChanelWithCount[t]) {
                    let earlyValue = allChanelWithCount[t]
                    allChanelWithCount[t] = ++earlyValue;
                }
                else {
                    allChanelWithCount[t] = 1;
                }
            })
    
            console.log(allChanelWithCount)
            allChanelWithCount = Object.entries(allChanelWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allChanelWithCount.length <= 5 ? allChanelWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                popularchanel.chanel.push(allChanelWithCount[i])
            }
            // res.json(payload)
            console.log(popularchanel,"hello")
            console.log(payload.users[0])
            // res.render("./dashboard/dashbaordpage.ejs",{popularchanel:popularchanel,payload:payload})
        })  
        /****************** Treading regions ********************************* */
        let popularRegions = {
            region: []
        }
        let allregionWithCount = {}
        let allregion = []
        userModel.find({}, { region: 1, _id: 0 }).then(chanels => {
            chanels.forEach(c => {
                allregion.push(c.region)
            })
            allregion.forEach(t => {
    
                if (allregionWithCount[t]) {
                    let earlyValue = allregionWithCount[t]
                    allregionWithCount[t] = ++earlyValue;
                }
                else {
                    allregionWithCount[t] = 1;
                }
            })
    
            console.log(allregionWithCount)
            allregionWithCount = Object.entries(allregionWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = allregionWithCount.length <= 5 ? allregionWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                popularRegions.region.push(allregionWithCount[i])
            }
            // res.json(payload)
            console.log(popularRegions,"hello")
            console.log(payload.users[0])
            // res.render("./dashboard/dashbaordpage.ejs",{popularchanel:popularchanel,payload:payload,popularRegions:popularRegions})
        })  

        /******************* Trading Tag ***************************** */
        let popularTag = {
            tag: []
        }
        let alltagWithCount = {}
        let alltag = []
        chanelModel.find({}, { chanelTag: 1, _id: 0 }).then(tag => {
            tag.forEach(c => {
                alltag.push(c.chanelTag)
            })
            alltag.forEach(t => {
    
                if (alltagWithCount[t]) {
                    let earlyValue = alltagWithCount[t]
                    alltagWithCount[t] = ++earlyValue;
                }
                else {
                    alltagWithCount[t] = 1;
                }
            })
    
            console.log(alltagWithCount)
            alltagWithCount = Object.entries(alltagWithCount).sort((a, b) => b[1] - a[1]).map(el => el[0])
    
            let loopEnd = alltagWithCount.length <= 5 ? alltagWithCount.length : 5
            for (let i = 0; i < loopEnd; i++) {
                popularTag.tag.push(alltagWithCount[i])
            }
            // res.json(payload)
            console.log(popularRegions,"hello")
            console.log(payload.users[0])
            res.render("./dashboard/dashbaordpage.ejs",{popularchanel:popularchanel,payload:payload,popularRegions:popularRegions,popularTag:popularTag})
        })  
    }
    else{
        res.redirect("/")
    }
 
})
module.exports = router