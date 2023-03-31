const express = require("express");
const axios = require("axios");
const paillier = require("paillier-bigint");
const userDetail = require("../db/Schema/userDetails");
const transactionDetails = require("../db/Schema/transactionDetails")
const bcrypt = require("bcryptjs");

const router = new express.Router(); 

router.get("/paillier/generatekeys", async (req, res) => {
  const { publicKey, privateKey } = await paillier.generateRandomKeys(64);
  const pub = {
    n: publicKey.n.toString(),
    _n2: publicKey._n2.toString(),
    g: publicKey.g.toString(),
  };

  const pvt = {
    lambda: privateKey.lambda.toString(),
    mu: privateKey.mu.toString(),
    _p: privateKey._p.toString(),
    _q: privateKey._q.toString(),
  };

  var encodedPub = btoa(JSON.stringify(pub));
  var encodedPvt = btoa(JSON.stringify(pvt));

  //to decode
  // var actual = JSON.parse(atob(encoded))

  res.json({ encodedPub, encodedPvt });
});

router.post("/paillier/sendmoney", async (req, res) => {
  const transactionKey = req.body.transactionKey; //(reciever pub key) manually entered
  const selfTranKey = req.body.selfTranKey; //(sender pub key)
  const hashKey = req.body.hashKey; //hasked pvt key of sender fro  db
  const isMatch = await bcrypt.compare(req.body.pvtKey, hashKey);
  var pub_key1 = JSON.parse(atob(transactionKey));
  var pub_key2 = JSON.parse(atob(selfTranKey));
  const value = req.body.value;
  function convertToBigInt(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = BigInt(obj[key]);
      } else if (typeof obj[key] === "object") {
        convertToBigInt(obj[key]);
      }
    }
  }
  
convertToBigInt(pub_key1);
const publicKey = new paillier.PublicKey(pub_key1.n, pub_key1.g);
const enc_value = publicKey.encrypt(value);
console.log(enc_value)

  convertToBigInt(pub_key1);
  convertToBigInt(pub_key2);
  const publicKey1 = new paillier.PublicKey(pub_key1.n, pub_key1.g);
  const publicKey2 = new paillier.PublicKey(pub_key2.n, pub_key2.g);
  const enc_value1 = publicKey1.encrypt(value);
  const enc_value2 = publicKey2.encrypt(value);
  console.log({ enc_value1, enc_value2 });
  const x = { x1: enc_value1.toString(), x2: enc_value2.toString() };
  res.send(x);
  if (!isMatch) {
    return res.send("Check you keys");
  }
});

router.get("/paillier/viewtransaction", async (req, res) => {
  const selfTranKey = req.body.selfTranKey; //(sender pub key)
  const hashKey = req.body.hashKey; //hashed pvt key of sender from  db
  const isMatch = await bcrypt.compare(req.body.pvtKey, hashKey);
  if (!isMatch) {
    return res.send("Check you keys");
  }
  const trans = await transactionDetails.find({receiver:selfTranKey})
//   res.send(trans)
var pvt_key1 = JSON.parse(atob(req.body.pvtKey));
var pub_key1 = JSON.parse(atob(req.body.selfTranKey));
// console.log(pub_key1)
function convertToBigInt(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = BigInt(obj[key]);
    } else if (typeof obj[key] === "object") {
      convertToBigInt(obj[key]);
    }
  }
}

convertToBigInt(pvt_key1)
convertToBigInt(pub_key1)
const publicKey = new paillier.PublicKey(pub_key1.n, pub_key1.g)
const privateKey = new paillier.PrivateKey(pvt_key1.lambda, pvt_key1.mu, publicKey, pvt_key1._p, pvt_key1._q )

console.log(privateKey)
  trans.forEach(element => {

    enc_transactionAmt = BigInt(atob(element.encrypted_value.x1))
    transactionAmt = privateKey.decrypt(enc_transactionAmt)
    enc_bal = BigInt(element.receiver_balance)
    bal = privateKey.decrypt(enc_bal)
    console.log(transactionAmt)
    console.log(bal)
  });
});

module.exports = router;
