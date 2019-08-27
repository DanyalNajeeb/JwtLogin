const jwt = require('jsonwebtoken')
// const config = require('./config')

module.exports = (req,res,next) => {
  console.log("in Token Checker");
    const token = req.body.token || req.query.token || req.headers['x-access-token'] ;
    console.log(token);
  // decode token
  if (token) {
      console.log("checking token for verification");
    // verifies secret and checks exp
    // var decoded = jwt.verify(JWTToken, 'secret');
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            console.log(decoded);
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
        console.log("verified token....");
      req.decoded = decoded;
      next();
    });
  } else{
    next();
  }
//   else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//         "error": true,
//         "message": 'No token provided.'
//     });
//   }
}

