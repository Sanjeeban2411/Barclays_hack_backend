const express = require("express");
const request = require("request");
// const mongoose = require('mongoose')
const axios = require("axios");
const userDetail = require("../db/Schema/userDetails");

const router = new express.Router();

router.post("/signUp", async (req, res) => {
  const postData = {
    name:req.body.name,
    age:req.body.age,
    gender:req.body.gender,
    contact:req.body.contact,
    transactionKey:req.body.transactionKey,
    password:req.body.password
  };
    axios.post("http://7ddd-4-193-250-126.ngrok.io/encrypt", postData)
    .then( async (response) => {
      const user = new userDetail({
        encData: response.data.encdata,
        aesKey_U: response.data.enc_aes_u,
        aesKey_Bank: response.data.enc_aes_b,
        nonce: response.data.Nonce,
        tag: response.data.Tag
      })
      await user.save()
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed fetching encrypted data" });
    });
});

router.post("/login", async (req, res) => {
  try {
    const key = req.body.aesKey;
    const user = await userDetail.findOne({ aesKey_U: key });
    if(!user){
        res.send("No data found, please recheck your key")
    }
    console.log(user)
    const postData = {
        enc_data_:user.encData,
        pvt_key_:req.body.pvt_key,
        aes_key_:key,
        nonce_:user.nonce,
        tag_:user.nonce,
      };
        axios.post("http://b3cf-4-193-250-126.ngrok.io/decrypt", postData)
        .then( async (response) => {
          res.json(response.data);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Failed fetching encrypted data" });
        });
    res.send({user})
    //call API-2 with (encrypted data, key, nonce, tag, req.body.pvtKey)
    //returns all user data along with password
    //verify password
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
