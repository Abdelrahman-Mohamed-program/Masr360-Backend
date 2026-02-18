const mongoose = require("mongoose")
const Favourite = new mongoose.Schema({
user : {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
},
type:{
    type:String,
    enum:["Place","Night","Product"]
},
targetId: {
     type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath:'type'
}


})