const mongoose = require('mongoose')

const URI = "mongodb+srv://Sanjeeban:mernbelove@cluster0.n39hzir.mongodb.net/major"

mongoose.connect(URI)
.then(console.log("Connected to MongoDB")) 