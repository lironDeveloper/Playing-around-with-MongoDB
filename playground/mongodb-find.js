const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) {
        console.log('Unable to connect to the ToDoApp mongodb server');
        return;
    } 
    console.log('Connected to the ToDoApp mongodb server succesfuly!');

    // Fetching all todos that havent completed yet from the DB
    db.collection('Todos').find({completed: false}).toArray()
        .then((docs) =>{
            console.log('All uncompleted todos : ', JSON.stringify(docs, undefined, 2));
        })
        .catch((err) => {
            console.log('Unable to fetch todos collection');            
        });


    db.collection('Todos').find().count()
    .then((count) =>{
        console.log('The number of todos in the todos collection is : ', count);
    })
    .catch((err) => {
        console.log('Unable to fetch todos collection');            
    });

    // Fetching a todo by ID from the DB
    db.collection('Todos').find({_id: new ObjectID('5ba641ece725aa3390ba15d2')}).toArray()
    .then((docs) =>{
        console.log('The todo with 5ba641ece725aa3390ba15d2 id is : ', JSON.stringify(docs, undefined, 2));
    })
    .catch((err) => {
        console.log('Unable to fetch todos collection');            
    });

    // Fetching all users from the DB
    db.collection('Users').find().toArray()
    .then((docs) =>{
        console.log('Users: ', JSON.stringify(docs, undefined, 2));
    })
    .catch((err) => {
        console.log('Unable to fetch users collection');            
    });

    // Calculate the number of users that their name is Liron

    var nameToFetch = 'Liron';

    db.collection('Users').find({name: nameToFetch}).toArray()
    .then((docs) =>{
        console.log(`The number of documents with the 
                    name ${nameToFetch} in the Users colection
                    is ${docs.length} and they are - ${JSON.stringify(docs, undefined, 2)}`);
    })
    .catch((err) => {
        console.log('Unable to fetch todos collection');            
    });
    db.close();
});