const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {ToDo} = require('./../../Models/todo');
var {User} = require('./../../Models/user');

var user1id = new ObjectID();
var user2id = new ObjectID();

const users = [{
    _id: user1id,
    email: 'liron.ostrovsky@gmail.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1id.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
    },
    {
    _id: user2id,
    email: 'jane@gmail.com',
    password: 'user2pass' ,
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user2id.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: user1id
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 111,
    _creator: user2id
}];

// Running a script before the test to set up the DB as we want
const populateTodos = (done) => {
    ToDo.remove({})
        .then(() => {
            return ToDo.insertMany(todos);
        })
        .then(() => {            
            done();            
        })
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => {
            done();
        })
};

module.exports = {
    populateTodos,todos,users, populateUsers
}