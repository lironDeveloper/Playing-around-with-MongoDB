const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) {
        console.log('Unable to connect to the ToDoApp mongodb server');
        return;
    } 
    console.log('Connected to the ToDoApp mongodb server succesfuly!');

    // Insert new todo into ToDos collection
    // db.collection('Todos').insertOne({
    //     text: 'ToDo something',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         console.log('Unable to insert a new todo');
    //         return;
    //     } 
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // Insert new user into users collection
    db.collection('Users').insertOne({
        name: 'Liron',
        age: 19,
        location: 'Israel'
    }, (err, result) => {
        if(err) {
            console.log('Unable to insert a new user');
            return;
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    db.close();
});