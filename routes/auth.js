const express = require("express")
const router = express.Router();
const userModel = require("../database/models/usersdata.js");
const sendMail = require("../utilis/sendMail");
const encryption = require("../utilis/encrypt")
const encrypt = encryption.encrypt;
const decrypt = encryption.decrypt;
const sha256 = encryption.sha256;

router.get("/login", (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("./autho/dashboard.ejs", { message: "", username: req.session.username });
    }
    else {
        res.render("./autho/login.ejs", { message: "",username:req.session.username})
    }
})
router.post("/login", (req, res) => {
    readUserDB(req.body.username, req.body.password, (user) => {
        if (user === null) {
            res.render("./autho/login.ejs", { message: "Username/Password is not correct😜"})
        }
        else if (!user.isVerified) {
            res.render("./autho/login.ejs", { message: "Email Not verified😒😢" })
        }
        else {
            req.session.isLoggedIn = true;
            req.session.username = req.body.username;
            req.session.isVerified = true
            res.render("./autho/dashboard.ejs", { username: req.session.username, message: ""})
        }
    })
})



router.get("/signup", (req, res) => {

    if (req.session.isLoggedIn) {
        res.redirect("/");
    }
    else {
        res.render("./autho/signup.ejs", { message: "" });
    }
})

router.post("/signup", (req, res) => {
    let user = req.body;
    let flag = false;
    readuserfromDataBase(user.email, (users) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === user.email) {
                console.log(i, " ")
                flag = true;
                break;
            }
        }
        userModel.find({ username: user.username }).then(function (usersByUsername) {
            for (let i = 0; i < usersByUsername.length; i++) {
                if (usersByUsername[i].username === user.username) {
                    console.log(i, " ")
                    flag = true;
                    break;
                }
            }
            if (flag) {
                res.render("./autho/signup.ejs", { message: "Username already exists🙂" })
            }
            else {
                writeUserDB(user, res);
            }
        })
    })
})


function readuserfromDataBase(username, call) {
    userModel.find({ email: username }).then(function (users) {
        call(users)
    })
}

function readUserDB(username, password, call) {
    console.log(username)
    userModel.findOne({ username: username, password: sha256(password) })
        .then(function (users) {
            call(users)
        })
}

function writeUserDB(user, res) {
    userModel.create({
        email: user.email,
        username: user.username,
        password: sha256(user.password),
        region: user.region,
        isVerified: false,
    }, () => {
        let encryptedObj = encrypt(user.email)
        let f = encryptedObj.iv;
        let s = encryptedObj.encryptedData;
        let str = f + "_" + s;
        let html = `<h1 style="text-align:center;">Welcome ${user.username}
        <pre>
        <p>Welcome in ChatApp, Please verify the mail for further process</p>` +
            '<a href="http://localhost:5000/verifyUser/' + str + '"><button style="cursor:move;background-color:green;width:200px;padding:1%">Click to verify</button></a>'

        sendMail(
            user.email,
            "Welcome in ChatApp",
            "Please click here to verify",
            html,
            function (err) {
                if (err) {
                    res.render("./autho/signup.ejs", { message: "enable to send email🤔" });
                }
                else {
                    res.render("./autho/signup.ejs", { message: "Please Verify The Email For Login😎😎" })
                }
            }

        )
    })
}

router.get("/verifyUser/:user", function (req, res) {

    let str = req.params.user;

    let arr = str.split("_");

    let obj = { iv: arr[0], encryptedData: arr[1] }
    let decryptedEmail = decrypt(obj)

    userModel.updateOne({ email: decryptedEmail }, { isVerified: true }, (err) => {
        if (err) {
            res.end("User not Verify😣");
        }
        else {
            res.render("./autho/login.ejs", { message: "Your Verification Complete, Now You can Login😉😉" })
        }
    })
})


router.get("/forgotPassword", (req, res) => {
    res.render("./autho/forgotPassword.ejs", { message: "" })
})

router.post("/forgotPassword", (req, res) => {
    let username = req.body.email
    userModel.find({ email: username }).then(function (users) {
        let flag = true;
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === req.body.email) {
                console.log(i, " ")
                flag = false;
                break;
            }
        }
        if (flag) {
            res.render("./autho/forgotPassword.ejs", { message: "Please create Account first🙂🙂" })
        }
        if (!flag) {
            let encryptedObj = encrypt(req.body.email)
            let f = encryptedObj.iv;
            let s = encryptedObj.encryptedData;
            let str = f + "_" + s;
            let html = `<h1 style="text-align:center;">Welcome  Back user
        <pre>
        <p>Welcome in ChatApp, Please verify the mail for further process</p>` +
                '<a href="http://localhost:5000/forgotPassword/' + str + '"><button style="cursor:pointer;background-color:green;width:200px;padding:1%">Click Here</button></a>'
            sendMail(
                username,
                "Welcome in ChatApp",
                "Please click here to verify",
                html,
                function (err) {
                    if (err) {
                        res.render("./autho/signup.ejs", { message: "enable to send email🙄" });
                    }
                    else {
                        res.render("./autho/forgotPassword.ejs", { message: "Please Check The Email For Change the Password🙂🙂" })
                    }
                }
            )
        }
    })
})



router.get("/forgotPassword/:username", (req, res) => {
    let str = req.params.username;
    console.log(str)
    let arr = str.split("_");
    let obj = { iv: arr[0], encryptedData: arr[1] }
    let decryptedEmail = decrypt(obj)

    res.render("./autho/setPassword.ejs", { email: decryptedEmail, message: "" })
})
router.get("/setPassword", (req, res) => {
    res.redirect("/setPassword")
})

router.post("/setPassword", (req, res) => {
    userNewPassword = req.body.userNewPassword;
    userConiformNewPassword = req.body.userConiformNewPassword;

    if (userNewPassword === userConiformNewPassword) {
        userModel.updateOne({ email: req.body.email }, { password: sha256(userConiformNewPassword) }, (err) => {
            if (err) {
                res.end("User not Verify");
            }
            else {
                res.render("./autho/login.ejs", { message: "Your Password is Reset😎😎" })
            }
        })
    }
    else {
        res.render("./autho/setPassword.ejs", { message: "Both Password doesn't match😑😑", username: req.body.username })
    }
})
router.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/")
})





module.exports = router