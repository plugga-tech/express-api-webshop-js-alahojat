var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

// Add product order for specific user
router.post('/add', (req, res) => {
  const userId = req.body.user;  
  const products = req.body.products;

  for (const product of products) {
    const productId = product.productId;
    const productQuantity = product.quantity;

    req.app.locals.db.collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found in database" });
        }

        return req.app.locals.db.collection("products").findOne({ _id: new ObjectId(productId) });
      })
      .then(product => {
        if (!product) {
          return res.status(404).json({ message: "This product does not exist"});
        }

        if (product.lager < productQuantity) {
          return res.status(400).json({ message: `Not enough products in stock with ID ${productId}` });
        }

        product.lager -= productQuantity;
        return req.app.locals.db.collection("products").updateOne({ _id: new ObjectId(productId) }, { $set: { lager: product.lager } });
      })
      .then(() => {
        const newCustomerOrder = { 
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
          quantity: productQuantity,
        };
        return req.app.locals.db.collection("orders").insertOne(newCustomerOrder);
      })
      .catch(error => {
        console.error("Error:", error);
        return res.status(400).json({ message: "Internal Server Error" });
      });
  }

  return res.status(201).json({ message: 'Order placed successfully' });
});

// Get all orders for customers
router.get('/all', async (req, res) => {
  
  req.app.locals.db.collection("orders").find().toArray()
  .then (result => {
    res.send(result);    
  })
});

module.exports = router;
