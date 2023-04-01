const express = require("express");
const axios = require("axios");
const paillier = require("paillier-bigint");
const userDetail = require("../db/Schema/userDetails");
const transactionDetails = require("../db/Schema/transactionDetails");
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

router.get("/paillier/viewtransaction", async (req, res) => {
  const selfTranKey = req.body.selfTranKey; //(sender pub key)
  const hashKey = req.body.hashKey; //hashed pvt key of sender from  db
  const isMatch = await bcrypt.compare(req.body.pvtKey, hashKey);
  if (!isMatch) {
    return res.send("Check you keys");
  }
  const trans = await transactionDetails.find({ receiver: selfTranKey });
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

  convertToBigInt(pvt_key1);
  convertToBigInt(pub_key1);
  const publicKey = new paillier.PublicKey(pub_key1.n, pub_key1.g);
  const privateKey = new paillier.PrivateKey(
    pvt_key1.lambda,
    pvt_key1.mu,
    publicKey,
    pvt_key1._p,
    pvt_key1._q
  );

  console.log(privateKey);
  trans.forEach((element) => {
    enc_transactionAmt = BigInt(atob(element.encrypted_value.x1));
    transactionAmt = privateKey.decrypt(enc_transactionAmt);
    enc_bal = BigInt(element.receiver_balance);
    bal = privateKey.decrypt(enc_bal);
    console.log(transactionAmt);
    console.log(bal);
    element.receiver_balance = bal.toString();
    element.encrypted_value.x1 = transactionAmt.toString();
  });
  res.send(trans);
});

router.post("/paillier/sendmoney", async (req, res) => {
  const transactionKey = req.body.transactionKey; //(reciever pub key) manually entered
  const selfTranKey = req.body.selfTranKey; //(sender pub key)
  const hashKey = req.body.hashKey; //hasked pvt key of sender fro  db
//   const pvt_key = req.body.pvt_key; //manualy
  const isMatch = await bcrypt.compare(req.body.pvtKey, hashKey);
  if (!isMatch) {
    return res.send("Check you keys");
  }
//   res.send("hi")

  const value = 200;
  // console.log(-value)
  var pub_key1 = JSON.parse(atob(req.body.transactionKey));
  var pub_key2 = JSON.parse(atob(req.body.selfTranKey));
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
  convertToBigInt(pub_key2);

  const publicKey1 = new paillier.PublicKey(pub_key1.n, pub_key1.g);
  const publicKey2 = new paillier.PublicKey(pub_key2.n, pub_key2.g);
  const senderDecrementValue = (publicKey2.encrypt((-value)));
  const recieverIncrementValue = (publicKey1.encrypt(value));

  const senderTrans = await transactionDetails.find({$or: [{sender: selfTranKey},
  {receiver: selfTranKey}]})
  const sender_balance = senderTrans[senderTrans.length-1].receiver_balance

  const recieveTrans = await transactionDetails.find({$or: [{sender: transactionKey},
  {receiver: transactionKey}]})
  const receiver_balance = recieveTrans[recieveTrans.length-1].receiver_balance
  
  const private_Key = JSON.parse(atob(req.body.pvtKey))

  convertToBigInt(private_Key)
  const privateKey = new paillier.PrivateKey(private_Key.lambda, private_Key.mu, publicKey2, private_Key._p, private_Key._q )
  // console.log(privateKey)
  sender_bal = BigInt(sender_balance)
  recevier_bal = BigInt(receiver_balance)
 

  receiver_new_bal = publicKey1.addition(recevier_bal,recieverIncrementValue)
  sender_new_bal = publicKey2.addition(sender_bal, senderDecrementValue)
  dec_s_b = privateKey.decrypt(sender_new_bal)
  console.log(dec_s_b)

  res.send({sender_balance, receiver_balance})

});

module.exports = router;
