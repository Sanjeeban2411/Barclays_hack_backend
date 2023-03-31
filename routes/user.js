const express = require("express");
const request = require("request");
// const mongoose = require('mongoose')
const axios = require("axios");
const bcrypt = require("bcryptjs");
const userDetail = require("../db/Schema/userDetails");
const transactionDetails = require("../db/Schema/transactionDetails")
const paillier = require("paillier-bigint");

const router = new express.Router();

router.post("/signUp", async (req, res) => {
  const pvtToken = await bcrypt.hash(req.body.keyHash, 8);
  console.log("hash",pvtToken)
  const postData = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    contact: req.body.contact,
    transactionKey: req.body.transactionKey,
    keyHash: pvtToken,
    password: req.body.password,
  };
  axios
    .post("http://f614-20-212-13-45.ngrok.io/encrypt", postData)
    .then(async (response) => {
      const user = new userDetail({
        encData: response.data.encdata,
        aesKey_U: response.data.enc_aes_u,
        aesKey_Bank: response.data.enc_aes_b,
        nonce: response.data.Nonce,
        tag: response.data.Tag,
      });
      await user.save();
      res.json({res: response.data, pvt_key: req.body.keyHash, hashed: pvtToken});
    })
    .catch((error) => {
      //   console.error(error);
      res.status(500).json({ error: "Failed fetching encrypted data" });
    });

    var pub_key1 = JSON.parse(atob(req.body.transactionKey));
    // console.log(pub_key1)
    function convertToBigInt(obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = BigInt(obj[key]);
        } else if (typeof obj[key] === 'object') {
          convertToBigInt(obj[key]);
        }
      }
    }
    
  convertToBigInt(pub_key1);
  const publicKey = new paillier.PublicKey(pub_key1.n, pub_key1.g);
  const enc_value = publicKey.encrypt(500);
  const enc_x1 = btoa(publicKey.encrypt(500));
    const transLog = new transactionDetails({
        transaction_id:83434,
        // sender:"dim329r8",
        receiver:req.body.transactionKey,
        encrypted_value:{x1:enc_x1,x2:null},
        receiver_balance:enc_value
    })
    transLog.save()
    console.log(enc_value, enc_x1)


});

router.post("/login", async (req, res) => {
  try {
    const key = req.body.aes_key_;
    const user = await userDetail.findOne({ aesKey_U: key });
    if (!user) {
      return res.send("No data found, please recheck your credentials");
    }
    console.log(user)
    const postData = {
      enc_data_: user.encData,
      pvt_key_: req.body.pvt_key_,
      aes_key_: key,
      nonce_: user.nonce,
      tag_: user.tag,
    };
    // res.send(postData)
    axios
      .post("http://f614-20-212-13-45.ngrok.io/decrypt", postData)
      .then(async (response) => {
        try {
          const parsedData = JSON.parse(response.data);
          // console.log(parsedData.Password)
          if (parsedData.Password !== req.body.password) {
            return res.send("Wrong Credentials");
          }
          res.json(response.data);
        } catch (error) {
          res.send({ error: "error" });
        }
      })
      // res.send(user)
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Failed fetching encrypted data" });
      });

    // res.send({user})
    // call API-2 with (encrypted data, key, nonce, tag, req.body.pvtKey)
    // returns all user data along with password
    // verify password
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
