const mongoose =  require("mongoose")
require("../mongo")

const StaticSchema = new mongoose.Schema({
    transaction_id:{
        // type: mongoose.SchemaTypes.Mixed,
        type:Number,
        required:true
    },
    sender:{
        type:Number,
        required:true
    },
    receiver:{
        type:Number,
        required:true
    },
    encrypted_value:{
        type:mongoose.SchemaTypes.Mixed,
        required:true
    },
    sender_balance:{
        type:Number,
        required:true
    },
    receiver_balance:{
        type:Number,
        required:true
    },
},{
    timestamps:true
})

const static = mongoose.model("transaction", StaticSchema)
module.exports = static