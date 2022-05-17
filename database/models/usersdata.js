var mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

email: {
    type: String,
    required: true,
    

  },
  username:{
    type: String,
    required: true,
    unique:true

  },
password:{
    type: String,
    required: true,
}, 
region:{
  type:String,
  required:true
},
isVerified:{
  type :Boolean,
  required:true
},
});

const userModel = mongoose.model('usersData', userSchema);

module.exports = userModel;