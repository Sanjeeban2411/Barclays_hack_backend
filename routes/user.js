const express = require('express')
// const mongoose = require('mongoose')

const userDetail = require('../db/Schema/static')

const router = new express.Router()

router.post('/saveData', async(req,res)=>{
    try {
        const data = new userDetail(req.body)
        await data.save()
        res.send({data}) //data already returned by API-1
    } catch (error) {
        res.send(error)
    }
})

router.post('/login', async(req,res)=>{
    try {
        const key = req.body.aesKey
        const user = userDetail.findOne({aesKey_U: key})

        //call API-2 with (encrypted data, key, nonce, tag, req.body.pvtKey) 
        //returns all user data along with password
        //verify password
        
    } catch (error) {
        res.send(error)
    }
})
