const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
    id: 10
};

var salt = '123abc'

// Hashing the data with a salt and store it in a token
var token = jwt.sign(data, salt);
console.log(token);

// Verifying the token
var decoded = jwt.verify(token, salt);
console.log('decoded', decoded);


// var message = "I am user liron";

// var hash = SHA256(message).toString();

// console.log(`Message: ${message} \nhash: ${hash}`);