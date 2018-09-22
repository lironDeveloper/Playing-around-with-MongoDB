const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) {
        console.log('Unable to connect to the ToDoApp mongodb server');
        return;
    } 
    console.log('Connected to the ToDoApp mongodb server succesfuly!');

    // deleteMany
    db.collection('Todos').deleteMany({text: 'Study node'})
        .then((result) =>{
            console.log(result);
        });

    // deleteOne
    db.collection('Todos').deleteOne({text: 'Study node'})
        .then((result) => {
            console.log(result.result);
        });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed: false})
        .then((result) => {
             console.log(result);
        });

    // Delete all users their name is Liron
    db.collection('Users').deleteMany({name: 'Liron'})
        .then((result) =>{
            console.log(result);
        });

    // Delete a random document by id
    db.collection('Users').find({name: 'Kim'}).toArray()
        .then((docs) =>{
            var kimsId = docs[0]._id;
            db.collection('Users').findOneAndDelete({_id: kimsId})
                .then((result) =>{
                    console.log(result);
                });
        });

    db.close();
});