const mongoose = require('mongoose');;

const messageSchema = mongoose.Schema({
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message:{
        type: String,
        required: true,
    }
},{
    timestamps: true,
})
const messageModel = mongoose.model("Message", messageSchema);
module.exports=messageModel