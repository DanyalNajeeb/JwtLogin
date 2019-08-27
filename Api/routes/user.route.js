
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
// const config = require('./config');
const tokenList = {};
router.post('/signup', function(req, res) {


   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash    
         });
         user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'New user has been created'
            });
            res.setHeader('Access-Control-Allow-Origin', '*');

         }).catch(error => {
            res.status(500).json({
               error: err
            });
         });
      }
   });
});
router.post('/signin', function(req, res){
 console.log("in /Signin0");
    User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
       console.log("in /signin1");
       
       bcrypt.compare(req.body.password, user.password, function(err, result){
          if(err) {
             console.log(err);
             return res.status(401).json({
                failed: 'Unauthorized Access'
             });
          }
          if(result) {
            console.log("Before result condition");
            if(result) {
               console.log("After result condition");
                const JWTToken = jwt.sign({
                  email: user.email,
                     // _id: user._id
                   },
                   'secret',
                    {
                      expiresIn: '60000'
                    });


                    const refreshToken = jwt.sign({
                     email: user.email,
                        // _id: user._id
                      }, 'refresh', 
                      { expiresIn: '1300000'
                     });
                     const response = {
                        "status": "Logged in",
                        "token": JWTToken,
                        "refreshToken": refreshToken,
                    }
                   
                    

                    var decoded = jwt.verify(JWTToken, 'secret');
                    console.log(decoded.email);

                    jwt.verify(JWTToken, 'secret', function(err, decoded) {
                     console.log(decoded.email) // bar
                   });
                   tokenList[refreshToken] = response
                   console.log(tokenList);
                  return res.status(200).json(response);
                  
                   //   return res.status(200).json({
                  //     success: 'Welcome to the JWT Auth',
                  //     token: JWTToken
                  //   });
               }


              
          }
         
          return res.status(401).json({
             failed: 'Unauthorized Access'
          });
       });
    })
    .catch(error => {
       console.log(error);
       res.status(500).json({
          
          error: error
       });
    });
 });
 router.post('/token', (req,res) => {
    console.log('directed /Token');
   // refresh the damn token
   const postData = req.body
   // if refresh token exists
   console.log("Post Data");
   console.log(postData.token);
   console.log("Token list");
   console.log(tokenList);
   if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
      //  const user = {
      //   "email": user.email,
      //    "_id": user._id
      //  }
       const token = jwt.sign({
         email: postData.email
         
          }, 'secret', { expiresIn: '610000'});

       const response = {
           "token": token,
       }
       var decoded = jwt.verify(token, 'secret');
       console.log("verify token");
       console.log(decoded.token);

       jwt.verify(token, 'secret', function(err, decoded) {
        console.log("decoded email");
         console.log(decoded.tokenList); // bar
      });
       // update the token in the list
       tokenList[postData.refreshToken].token = token
       console.log("Printing token List after");
       console.log(tokenList);
       console.log("response");
       console.log(response);
       res.status(200).json(response);        
   } else {
       res.status(404).send('Invalid request')
   }
});
router.post('/secure', (req,res) => {
   console.log('In /Secure ');
  // refresh the damn token
  const postData = req.body
  console.log(postData.token);
  if (postData.token) {
   console.log("checking token for verification");
 // verifies secret and checks exp
 // var decoded = jwt.verify(JWTToken, 'secret');

//  var decoded = jwt.verify(postData.token, 'secret');
//  console.log("verify token");
//  console.log(decoded.token);

 jwt.verify(postData.token, 'secret', function(err, decoded) {
     if (err) {
         console.log(decoded);
         return res.status(200).json({"error": true, "message": 'Unauthorized access.' });
     }else{
   //   console.log("verified token....");
     console.log(decoded);
     res.status(200).json("verified token...."); 

   }
 });
} else{
 console.log("no token");
}
});
router.use( function(req, res, next) {
   console.log("server init");
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
 });
router.use(require('../routes/tokenChecker'));


module.exports = router;