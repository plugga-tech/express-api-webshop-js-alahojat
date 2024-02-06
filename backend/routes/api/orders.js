var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');


router.post('/add', (req, res) => {
  console.log("Request body:", req.body);

  const userId = req.body.user; // Corrected user ID extraction
  console.log("user ID from request", userId);
  
  const products = req.body.products; // Corrected product extraction

  // Loop through each product in the request
  for (const product of products) {
    const productId = product.productId;
    const productQuantity = product.quantity;

    // Fetch user information from the users collection
    req.app.locals.db.collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        if (!user) {
          console.log("User not found in database");
          return res.status(404).json({ message: "User not found in database" });
        }

        console.log("User found:", user);

        // Find the product by productId
        return req.app.locals.db.collection("products").findOne({ _id: new ObjectId(productId) });
      })
      .then(product => {
        if (!product) {
          console.log("Product not found in database");
          return res.status(404).json({ message: "This product does not exist"});
        }

        // Check if there's enough of hte product in stock
        if (product.lager < productQuantity) {
          console.log("Not enough products in stock");
          return res.status(400).json({ message: `Not enough products in stock with ID ${productId}` });
        }

        // Update the amount of products in stock
        product.lager -= productQuantity;
        return req.app.locals.db.collection("products").updateOne({ _id: new ObjectId(productId) }, { $set: { lager: product.lager } });
      })
      .then(result => {
        // Create a customer order doc
        const newCustomerOrder = { 
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
          quantity: productQuantity,
        };

        return req.app.locals.db.collection("orders").insertOne(newCustomerOrder);
      })
      .catch(error => {
        console.error("Error:", error);
        // Send internal server error response
        return res.status(500).json({ message: "Internal Server Error" });
      });
  }

  // After processing all products, send the success response
  return res.status(201).json({ message: 'Order placed successfully' });
});




// Get all orders for customers
router.get('/all', async (req, res) => {
  console.log("Helllooo", req.body);

  req.app.locals.db.collection("orders").find().toArray()
  .then (result => {
    res.send(result);    
  })
});



module.exports = router;
