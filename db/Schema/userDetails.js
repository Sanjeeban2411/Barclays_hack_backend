const mongoose =  require("mongoose")
require("../mongo")

const StaticSchema = new mongoose.Schema({
    encData:{
        // type: mongoose.SchemaTypes.Mixed,
        type:String,
        required:true
    },
    aesKey_U:{
        type:String,
        required:true
    },
    aesKey_Bank:{
        type:String,
        required:true
    },
    nonce:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    }
})

const static = mongoose.model("userDetail", StaticSchema)
module.exports = static