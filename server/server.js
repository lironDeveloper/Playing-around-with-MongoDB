const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./DB/mongoose-conf');
var {ToDo} = require('./Models/todo');
var {User} = require('./Models/user');


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
    })

app.listen(3000, () => {
    console.log('Started app at 3000');
});

module.exports = {
    app
}