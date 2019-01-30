const express=require('express');
const mongoose=require('mongoose');
const restaurant=require("./api/modules/getRestaurant")
const cors=require('cors');
const bodyparser=require('body-parser');
const db = require("./resDatabase");
const app = db.app;
app.use(cors());
app.use(bodyparser.json());
app.use('/api',restaurant)
app.get('/apit',(req,res)=>{
    console.log("hii")
})

module.exports=app;