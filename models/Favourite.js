const mongoose = require("mongoose")
const Favourite = new mongoose.Schema({
user : {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
},
targetId: {
     type: mongoose.Schema.Types.ObjectId, 
    required: true,
},
type:{
    type:String,
    enum:["place","night","product"]
}


})