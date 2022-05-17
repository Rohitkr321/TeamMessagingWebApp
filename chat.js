const express = require("express");
const { isStringObject } = require("util/types");
const app = express();
const http = require("http").createServer(app)
const bodyParser = require('body-parser');
const db = require("./database");
const messageModel = require("./database/models/messageModel.js");
const moment = require("moment");
const { monthsShort } = require("moment");

let myTime = moment(Date.now()).format("hh:mm:ss a")
console.log(myTime)
db.start();
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
})



app.set("view engine", "ejs")
/**************** MiddileWare ********************* */
app.use("/static", express.static(__dirname + '/static'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))


/****************  Socket ********************* */

const io = require('socket.io')(http) //http server of main server.

io.on('connection', (socket) => {
    console.log('New User connected with id', socket.id)
    let arr = [];
    messageModel.find().then(result => {
        socket.emit('returnmessage', result)
    })
    socket.on('message', (msg) => {
        let messages = JSON.stringify(msg.postIdFormessages)
        let mess = new messageModel({message:msg.message,postId:messages,username:msg.username,time:msg.time,type:msg.type})
        mess.save().then(() =>{
            let id = msg.postIdFormessages;
            socket.join(id);
            socket.to(id).emit('message', msg)
        })
    })
    socket.on("disconnect", () => {
        console.log("User Disconneceted")
    })
})

