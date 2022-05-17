const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session")
const db = require("./database");


db.start();
app.set("view engine", "ejs")
/**************** MiddileWare ********************* */
app.use("/static", express.static(__dirname + '/static'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'Rohit',
    resave: false,
    saveUninitialized: true,
}))

app.get('/', (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("./autho/dashboard.ejs", { message: "", username: req.session.username })
    }
    else {
        res.render("./autho/login.ejs", { message: "", username: req.session.username })
    }
})

/******************************************************
        Authorization and Authentication
 ******************************************************/
const auth = require('./routes/auth')
app.use(auth)



/*********************************************************************
                        Add Chanel
 **********************************************************************/
const chanel = require('./routes/chanel')
app.use(chanel)


/**************************************************************************
                            Dashboard
 ***************************************************************************/
const dashbaord = require('./routes/dashboard')
app.use(dashbaord)


/******************** sever listen *********************************** */
let port = 5000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})

