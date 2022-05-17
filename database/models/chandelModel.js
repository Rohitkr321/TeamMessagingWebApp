var mongoose = require("mongoose");
const chanelSchema = new mongoose.Schema({

  chanelName: {
    type: String,
    required: true,
  },
  chanelDescription: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  chanelTag: {
    type: String,
    required: true,
  },
  member: {
    type: [String],
  },
  chanelId: {
    type: String,
    required: true
  },
  confirm :{
    type:Boolean,
    default:true,
    required:true
  },
  creator:{
    type:Boolean,
    default:true,
    required:true
  },
});

const chanelModel = mongoose.model('chandelData', chanelSchema);

module.exports = chanelModel;