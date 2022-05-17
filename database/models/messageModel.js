var mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({

message:{
    type:String,
    required:true,
},
postId:{
    type:String,
    required:true,
},
time:{
    type:String,
    required:true,
},
username:{
    type:String,
    required:true,
},
type:{
    type:String,
    required:true
}
},{timestamps:true});

const messageModel = mongoose.model('messageModelData', messageSchema);

module.exports = messageModel;