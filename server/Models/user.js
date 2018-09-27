var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            mesaage: '{VALUE} is not a valid email'
        }      
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Changing the method toJSON so that it it will return to the user
// Only the id and his email
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// Generating the toekn for the user
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    return user.save()
        .then(() => {
            return token;
        });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    // Pulling from the array of tokens all the objects include
    // The token that send to the function
    return user.update({
        $pull: {
            tokens: {token}
        }
    });

}

// Method that lets us to find a user by it token
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email})
        .then((user) => {

            // In case user does not exist
            if(!user) {
               throw new Error();
            }

            return bcrypt.compare(password, user.password)
                .then((res) => {
                    if(res){
                        return Promise.resolve(user);
                    } else {
                        throw new Error();
                    }
                })
                .catch((err) => {return Promise.reject()});
        }) 
        .catch((e) => {return Promise.reject()});
}

// Middleware that will run before user is saved 
UserSchema.pre('save', function (next) {
    var user = this;

    // Checking if user modified the password field in this call
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
               user.password = hash;
               next();
            });
        });
    } else {
        next();
    }
});

var User =  mongoose.model('Users', UserSchema);

module.exports = {User};