var express = require('express');
var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("users").find().toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
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
