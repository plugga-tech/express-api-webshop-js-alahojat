var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

// Get all products
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("products").find().toArray()
  .then (result => {
    res.send(result);    
  })
  .catch(error => {
    console.error("Error getting products:", error);
    res.status(400).json({ error: "Failed to get all products" });
  })
});

// Get product specific ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  req.app.locals.db.collection("products")
  .findOne({ _id: new ObjectId(productId) })
  .then(ifProductIdExists => {
    if (ifProductIdExists) {
      res.json(ifProductIdExists);
    } else {
      res.status(404).json({ message: "This product does not exist!" });
    }
  })
});

// Create a new product
router.post("/add", (req, res) => {
  let newProduct = req.body;
  
  req.app.locals.db.collection("products").insertOne(newProduct)
  .then(() => {
    res.json(newProduct);
  })
  .catch(error => {
    console.error("Error creating new product:", error);
    res.status(400).json({ error: "Unable to create a new product" });
  });
});

module.exports = router;
