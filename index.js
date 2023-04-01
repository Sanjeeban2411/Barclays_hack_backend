const paillier = require("paillier-bigint");
const express = require("express");
require("./db/mongo")
const userRoutes = require('./routes/user')
const transactionRoutes = require('./routes/transactions')
var cors = require('cors');
const app = express();
app.use(cors());


// app.get("/generatekeys", async function paillierTest(req, res) {
//   const { publicKey, privateKey } = await paillier.generateRandomKeys(64);
//   const pub = publicKey;
//   const pvt = {
//     lambda: privateKey.lambda,
//     mu: privateKey.mu,
//     _p: privateKey._p,
//     _q: privateKey._q,
//   };

//   const pvtJson = JSON.stringify(pvt, (key, value) => {
//     return typeof value === "bigint" ? value.toString() : value;
//   });
//   const outputPvt = JSON.parse(pvtJson);

//   const pubJson = JSON.stringify(pub, (key, value) => {
//     return typeof value === "bigint" ? value.toString() : value;
//   });
//   const outputPub = JSON.parse(pubJson);

//   res.send({ outputPub, outputPvt });
// });
// app.use(function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json())
app.use(userRoutes)
app.use(transactionRoutes)

app.listen(8000, () => {
  console.log("listening on 8000");
});

