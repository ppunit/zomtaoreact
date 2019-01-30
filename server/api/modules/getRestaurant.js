const express = require("express");
const router = express.Router();
const schema = require('../schema/restaurantSchema');
//getting books api
router.get('/restaurants/trending', (req, res) => {
    

    schema.count().exec(function (err, count) {
        var random = Math.floor(Math.random() * count)
        schema.find().skip(random).exec(function (err, result) {
            result = result.slice(0, 10)
            res.send(result)
        })
    })
})

//get restaurant by searching with their names or city or cuisins or locality
router.get('/restaurants/search/', (req, res) => {
    console.log(req.query.search)
    var re = new RegExp(/^[a-zA-Z0-9 ]*$/);
    const searchPattern=req.query.search;
    if(re.test(searchPattern)){

    
    const regex = new RegExp(req.query.search, 'gi');

    schema.find({
        $or: [{ "name": regex },
        { "location.city": regex },
        { "cuisines": regex },
        { "location.locality": regex }
        ]
    }).then(restaurant => {

        res.send(restaurant).status(200)
    })
        .catch(err => {
            res.send(404);
        })
    }
    else{
        res.status(400).send("search should be a name or string")
    }

})

//get restaurant with their id
router.get('/restaurants/:id', (req, res) => {
    const restaurantIdToBeSearch = req.params.id
    console.log(req.params.id)
    var re = new RegExp(/^(\d{1,8})$/);
    if (re.test(restaurantIdToBeSearch)) {
        schema.find({
            id: restaurantIdToBeSearch
        }).then(availableRestaurant => {
                if (availableRestaurant.length > 0)
                    res.status(200).send(availableRestaurant)
                else
                    res.status(400).json({
                        message: "restaurant not found"
                    });
            })
            .catch(err => res.status(400).send(err))
    }
    else {
        res.status(400).send("Invalid search the search should be a 1-8 digit number");
    }


})
module.exports = router