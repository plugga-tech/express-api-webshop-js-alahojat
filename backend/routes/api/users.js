var express = require('express');
var router = express.Router();
let { randomUUID } = require('crypto'); //importera in unikt ID paket från npm
const { ObjectId } = require('mongodb');
const { log, error } = require('console');

// Get all users
router.get('/', function(req, res) {

  let projection = { password: 0};

  req.app.locals.db.collection("users").find({}, { projection: projection}).toArray()
  .then (result => {
    res.send(result);    
  })
});


// Get specific user ID
router.post("/", (req, res) => {
  const userId = req.body.id;

   req.app.locals.db.collection("users")
   .findOne({ _id: new ObjectId(userId) })
    .then(ifIdExists => {
      if (ifIdExists) {
        res.json(ifIdExists);
      } else {
        res.status(404).json({ message: "This user does not exists!" });
      }
    })
});

// Create a new user
router.post("/add", (req, res) => {
  let user = req.body;
  
  req.app.locals.db.collection("users").insertOne(user)
  .then(() => {
    res.json(user);
  })
  .catch(error => {
    console.error("Error inserting user:", error);
    res.status(401).json({ error: "Unable to create new user" });
  });
});


// Login specific user
router.post("/login", (req, res) => {

  let correctPassword = req.body.password;
  let correctEmail = req.body.email;
  
  req.app.locals.db.collection("users")
  .findOne({ email: correctEmail, password: correctPassword })
  .then(userLoggedIn => {
    if (userLoggedIn) {
      res.json(userLoggedIn);
    } else {
      res.status(401).json({message: "Wrong username and/or password"});
    } 
  })
});


module.exports = router;

