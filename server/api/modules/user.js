const express = require('express');
const router = express.Router();
const joi = require('joi')
const userSchema = require('../schema/userSchema');

let validateEmail = function (email) {
    return new Promise((resolve, reject) => {
        var emailSchema = joi.string().email().required()
        joi.validate(email, emailSchema, (err, result) => {
            if (err) {
                console.log(err)
                reject(new Error("email is not proper"))
            }
            else {
                resolve("200")
            }
        })

    })
}

let validateBooking = function (bookingDetail) {
    return new Promise((resolve, reject) => {
        var bookingSchema = joi.object().keys({
            restaurant_id: joi.string().min(1).max(8).required(),
            restaurant_name: joi.string().required(),
            restaurant_image: joi.string().required(),
            restaurant_address: joi.string().required(),
            booking_time: joi.string().regex(/^(\b((1[0-2]|0?[1-9]):([0-5][0-9])([AaPp][Mm])))$/).required(),
            booking_date: joi.string().required(),
            guest: joi.number().min(1).max(10).required()

        })
        joi.validate(bookingDetail, bookingSchema, (err, result) => {
            if (err) {
                console.log(err)
                reject(new Error("booking detail is not proper"))
            }
            else {
                resolve("200")
            }
        })
    })

}

router.post("/user", (req, res) => {
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let phoneno = req.body.phoneno;
    const createUserSchema = joi.object().keys({
        name: joi.string().min(2).max(30).required(),
        phoneno: joi.string().min(0).max(10),
        email: joi.string().email().required()
    });
    joi.validate(req.body, createUserSchema, (err, result) => {
        if (err) {
            console.log(err)
            res.status("422").send("details are not proper")//not a valid user
        }
    })
    userSchema.find({
        "email": req.body.name
    })
        .then(result => {
            if (result.length > 0) {
                res.send("422")
            }
            else {
                var newuser = new userSchema({
                    name: req.body.name,
                    mobileno: phoneno,
                    booking: [],
                    email: email
                })
                newuser.save(function (err, newuser) {
                    if (err) {
                        console.log(err);
                        return new Error("404");
                    }
                    else {
                        res.status('201').send(newuser);
                        console.log("done")
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.send("404");//cannot add a user
        })

})

router.get('/user/:id', (req, res) => {
    console.log("now",req.params.id)
    validateEmail(req.params.id)
        .then(result => {
            return userSchema.find({
                "email": req.params.id
            })
        })
        .then(result => 
            {console.log(result)
                if(result.length>0)
                res.send(result)
                else
                {
                    res.send('404')
                }
                
            }

        )


        .catch(err => {
            res.status('404').send('user not found')
            console.log(err)})
        
})

router.post("/bookings", (req, res) => {
    console.log(req.body)
    validateEmail(req.headers.email)
        .then(response => {
            return validateBooking(req.body)
        })
        .then(result => {
            return userSchema.updateOne({
                "email": req.headers.email
            }, {
                    $push: {
                        booking: req.body
                    }
                })
        })
        .then(result => {
            if (result.n > 0)
                res.send("201")


            else {
                res.send("422")


            }


        })

        .catch(err => console.log(err))
})

router.put('/user/update', (req, res) => {
    console.log('hii')
    const createUserSchema = joi.object().keys({
        name: joi.string().min(2).max(30).required(),
        phoneno: joi.string().regex(/^[0-9]{10}$/),
        email: joi.string().email().required()
    });
    joi.validate(req.body, createUserSchema, (err, result) => {
        if (err) {
            console.log(err)
            res.status("422").send("details are not proper")//not a valid user
        }
    })
    userSchema.updateOne({
        email: req.body.email
    }, { name: req.body.name, mobileno: req.body.phoneno }

    ).then(data => { 
        if(data.nModified>0){
            console.log(data)
        res.status('201').send(data)
        }
        else{
            console.log("done")
        res.send('422') }})
       
        .catch((err) => console.log(err))



})

module.exports = router;