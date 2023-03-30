const mongoose = require('mongoose')

const URI = "mongodb+srv://Sanjeeban:barc_proteus_xxx@cluster0.n39hzir.mongodb.net/test"

mongoose.connect(URI)
.then(console.log("Connected to MongoDB")) 