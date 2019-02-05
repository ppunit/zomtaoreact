const express=require('express');
const mongoose=require('mongoose');
const restaurant=require("./api/modules/getRestaurant");
const user=require("./api/modules/user");
const cors=require('cors');
const bodyparser=require('body-parser');
const db = require("./resDatabase");
const app = db.app;
app.use(cors());
app.use(bodyparser.json());
app.use('/api/restaurants',restaurant)
app.use('/api',user)


module.exports=app;