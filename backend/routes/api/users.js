var express = require('express');
var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res) {

  let projection = { password: 0};

  req.app.locals.db.collection("users").find({}, { projection: projection}).toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
  })
});



router.post("/", (req, res) => {
  let userId = req.body.id;

  req.app.locals.db.collection("users").findOne({ id: userId })
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
