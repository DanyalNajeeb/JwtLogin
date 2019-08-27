const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user.route');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jwtauth', { useNewUrlParser: true });

const PORT = 3001;
// app.use(cors());
// app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use( function(req, res, next) {
   console.log("server init");
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
});



app.use('/user', user);

app.listen(PORT, function(){
   console.log('Server is running on Port',PORT);
});


