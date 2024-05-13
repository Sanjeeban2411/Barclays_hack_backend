const paillier = require("paillier-bigint");
const express = require("express");
require("./db/mongo")
const userRoutes = require('./routes/user')
const transactionRoutes = require('./routes/transactions')
var cors = require('cors');
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());

app.use(express.json())
app.use(userRoutes)
app.use(transactionRoutes)

app.listen(8000, () => {
  console.log("listening on 8000");
});

