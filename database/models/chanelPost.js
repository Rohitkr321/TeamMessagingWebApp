var mongoose = require("mongoose");
const chanelPostSchema = new mongoose.Schema({

username:{
    type:String,
    required:true,
},
postName:{
    type:String,
    required:true,
},
chanelId:{
    type:String,
    required:true,
},
postChanelName:{
    type:String,
    required:true,
},
createTime:{
    type:String,
    required:true
},
},{timestamps:true});

const chanelPostModel = mongoose.model('chandelPostData', chanelPostSchema);

module.exports = chanelPostModel;