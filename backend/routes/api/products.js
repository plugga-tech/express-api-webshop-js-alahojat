var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("products").find().toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
  })
});


// GET product specific ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;

   req.app.locals.db.collection("products")
   .findOne({ _id: new ObjectId(productId) })
    .then(ifProductIdExists => {
      // If user is found in MongoDB, send it in the response
      if (ifProductIdExists) {
        res.json(ifProductIdExists);
      } else {
        // If not found in MongoDB, return a 404 status
        res.status(404).json({ message: "This product does not exist!" });
       
      }
    })
   
});

// CREATE A NEW PRODUCT

router.post("/add", (req, res) => {

  let newProduct = req.body;
  
  req.app.locals.db.collection("products").insertOne(newProduct)
  .then(() => {
    console.log(newProduct);
    res.json(newProduct);
  })
});


module.exports = router;
