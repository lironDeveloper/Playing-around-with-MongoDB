const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
    console.log('Started app at 3000');
});

module.exports = {
    app
}