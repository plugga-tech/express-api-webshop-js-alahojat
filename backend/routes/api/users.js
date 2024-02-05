var express = require('express');
var router = express.Router();
let { randomUUID } = require('crypto'); //importera in unikt ID paket från npm
const { ObjectId } = require('mongodb');



/* GET users listing. */
router.get('/', function(req, res) {

  let projection = { password: 0};

  req.app.locals.db.collection("users").find({}, { projection: projection}).toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
  })
});


// Get specific user ID
router.post("/", (req, res) => {
  const userId = req.body.id;

   req.app.locals.db.collection("users").findOne({ _id: new ObjectId(userId) })
    .then(ifIdExists => {
      // If user is found in MongoDB, send it in the response
      if (ifIdExists) {
        res.json(ifIdExists);
      } else {
        // If not found in MongoDB, return a 404 status
        res.status(404).json({ message: "No such user in the database!" });
       
      }
    })
   
});

// CREATE USER
router.post("/add", (req, res) => {

  let user = req.body;
  
  req.app.locals.db.collection("users").insertOne(user)
  .then(() => {
    console.log(user);
    res.json(user);
  })
  
});




module.exports = router;


/**
 * 
 *let printUserDataBase = "<div><h2>All users</h2>"

for (user in result) {
  printUserDataBase += "<div>" + result[user].name + "</div>"
}

printUserDataBase += "</div>"
 * 
 * 
 */
