var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("orders").find().toArray()
  .then (result => {
    console.log(result);
    res.send(result);    
  })
});



module.exports = router;
