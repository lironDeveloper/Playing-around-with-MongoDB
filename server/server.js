require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./DB/mongoose-conf');
var {ToDo} = require('./Models/todo');
var {User} = require('./Models/user');
var {authenticate} = require('./Middleware/authenticate');

var PORT = process.env.PORT;

var app = express();

// Middleware that parses the body of the 
// request to be a json
app.use(bodyParser.json());

// Adding new todo
app.post('/todos', (req, res) => {
    var todo = new ToDo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.status(200).send(doc);
            
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

// Getting all todos
app.get('/todos', (req, res) => {

    ToDo.find()
        .then((todos) => {
        res.status(200).send({todos});
        })
        .catch((err) => {
            res.status(400).send(err);
        })
});

// Getting todo by id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    // Valid id
    if(!ObjectID.isValid(id)){
        res.status(404).send("The ID is invalid");
    } else {
        ToDo.findById(id)
            .then((todo) => {
                if(!todo){
                    res.status(404).send("There is no any TODO with that ID");
                } else {
                    res.status(200).send({todo});
                }
            })
            .catch((err) => {
                res.status(400).send();
            });
    }
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id
    
    // Valid id
    if(!ObjectID.isValid(id)){
        res.status(404).send("The ID is invalid");
    } else {
        ToDo.findByIdAndRemove(id)
            .then((todo) => {
                if(!todo){
                    res.status(404).send("There is no any TODO with that ID");
                } else {
                    res.status(200).send({todo});
                }
            })
            .catch((err) => {
                res.status(400).send();
            });
    }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    
    // Valid id
    if(!ObjectID.isValid(id)){
       return res.status(404).send("The ID is invalid");
    } 

    // Check if user completed its todo
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    ToDo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then((todo) => {
            if(!todo){
                res.status(404).send("There is no any TODO with that ID");
            } else {
                res.status(200).send({todo});
            }
        })
        .catch((err) => {
            res.status(400).send();
        });
    
});

// Creating a new user
app.post('/users', (req, res) => {
    var body =  _.pick(req.body, ['email', 'password']);

    var user = new User(body);

    user.save()
        .then((user) => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.get('/users/me', authenticate,  (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var email = body.email;
    var password = body.password;

    User.findByCredentials(email, password)
        .then((user) => {
            user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send(user);                    
                })
        })
        .catch((err) => {
            res.status(400).send();
        });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => {
            res.status(400).send();
        });
})

app.listen(PORT, () => {
    console.log(`Started app at ${PORT}`);
});

module.exports = {app}