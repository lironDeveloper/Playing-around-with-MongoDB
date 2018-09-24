const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./DB/mongoose-conf');
var {ToDo} = require('./Models/todo');
var {User} = require('./Models/user');

var PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Started app at ${PORT}`);
});

module.exports = {
    app
}