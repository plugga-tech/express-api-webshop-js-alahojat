var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');


router.post('/add', async (req, res) => {
  const userId = req.body.userId;
  const products = req.body.products;

  const customer = await req.app.locals.db.collection("users").findOne({ _id: new ObjectId(userId) });

  if (!customer) {
    res.status(401).json({ message: "This user does not exist in the database"});
  };

  const newCustomerOrder = {
    userId: new ObjectId(userId),
    products: products 
  };

  await req.app.locals.db.collection("orders").insertOne(newCustomerOrder);

  res.redirect('/api/orders/all');
  // redirect to orders/all
  console.log(customer);
});

  

// Get all orders for customers
router.get('/all', async (req, res) => {

  req.app.locals.db.collection("orders").find().toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
  })
});






module.exports = router;
