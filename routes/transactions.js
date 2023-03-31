const express = require("express");
const axios = require("axios");
const paillier = require("paillier-bigint");
const userDetail = require("../db/Schema/userDetails");
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
  const transactionKey = req.body.transactionKey; //(reciever) manually entered
  const hashKey = req.body.hashKey;
  const isMatch = await bcrypt.compare(req.body.pvtKey, hashKey);
  var pub_key = JSON.parse(atob(transactionKey));

  res.send(pub_key)
  if (!isMatch) {
    return res.send("Check you keys");
  }
});

router.get("/paillier/viewtransaction", async (req, res) => {});

module.exports = router;
