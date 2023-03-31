const mongoose =  require("mongoose")
require("../mongo")

const StaticSchema = new mongoose.Schema({
    transaction_id:{
        // type: mongoose.SchemaTypes.Mixed,
        type:Number,
        required:true
    },
    sender:{
        type:String,
        // required:true
    },
    receiver:{
        type:String,
        // required:true
    },
    encrypted_value:{
        type:mongoose.SchemaTypes.Mixed,
        required:true
    },
    sender_balance:{
        type:String,
        // required:true
    },
    receiver_balance:{
        type:String,
        // required:true
    },
},{
    timestamps:true
})

const static = mongoose.model("transaction", StaticSchema)
module.exports = static